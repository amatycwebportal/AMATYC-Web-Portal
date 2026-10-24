// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';
import AcceptInvite from './AcceptInvite';

const REDIRECT_FALLBACK_DELAY_MS = 10_000;
const BACKEND_URL = 'http://backend.test';
const INVITE_TOKEN = 'invite-token';

const consentedUser = {
  privacyConsentAcceptedAt: '2026-01-01T00:00:00.000Z',
  privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
};

function LocationProbe() {
  const location = useLocation();
  return <div>{`${location.pathname}${location.search}`}</div>;
}

function renderAcceptInvite(initialPath: string) {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/accept-invite/" element={<AcceptInvite />} />
        <Route path="/privacy-consent" element={<LocationProbe />} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/" element={<div>Home page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function createJsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('AcceptInvite waiting state', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_BACKEND_URL', BACKEND_URL);
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => undefined))
    );
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('shows a spinner and a home link after 10 seconds when the request does not finish', async () => {
    renderAcceptInvite(`/accept-invite/?token=${INVITE_TOKEN}`);

    expect(screen.getByRole('progressbar', { name: 'Accepting invite' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Accepting invite' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'click here' })).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(REDIRECT_FALLBACK_DELAY_MS);
    });

    fireEvent.click(screen.getByRole('link', { name: 'click here' }));

    expect(screen.getByText('Home page')).toBeTruthy();
  });
});

describe('AcceptInvite error routing', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_BACKEND_URL', BACKEND_URL);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('shows a home action when the invitation service is unavailable', () => {
    vi.stubEnv('VITE_BACKEND_URL', '');
    renderAcceptInvite(`/accept-invite/?token=${INVITE_TOKEN}`);

    expect(screen.getByText('The invitation service is unavailable.')).toBeTruthy();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('shows a home action when the invitation link has no token', () => {
    renderAcceptInvite('/accept-invite/');

    expect(screen.getByRole('heading', { name: 'Unable to accept invite' })).toBeTruthy();
    expect(screen.getByText('This invitation link is missing a token.')).toBeTruthy();
    expect(screen.queryByRole('progressbar')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Go to home page' }));

    expect(screen.getByText('Home page')).toBeTruthy();
  });

  it('sends signed-out people to privacy consent before sign-in', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createJsonResponse(401, { authenticated: false }))
    );

    renderAcceptInvite(`/accept-invite/?token=${INVITE_TOKEN}`);

    await waitFor(() => {
      expect(screen.getByText(/\/privacy-consent\?returnTo=/)).toBeTruthy();
    });
    expect(screen.getByText(/sign-in/)).toBeTruthy();
  });

  it('sends an already accepted invitation to the profile page', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(createJsonResponse(200, { user: consentedUser }))
        .mockResolvedValueOnce(createJsonResponse(409, { error: 'Invitation already accepted' }))
    );

    renderAcceptInvite(`/accept-invite/?token=${INVITE_TOKEN}`);

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeTruthy();
    });
  });

  it('shows a home action when the invitation cannot be found', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(createJsonResponse(200, { user: consentedUser }))
        .mockResolvedValueOnce(createJsonResponse(404, { error: 'Invitation not found' }))
    );

    renderAcceptInvite(`/accept-invite/?token=${INVITE_TOKEN}`);

    expect(await screen.findByText('This invitation could not be found.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Go to home page' }));
    expect(screen.getByText('Home page')).toBeTruthy();
  });

  it('shows a home action when the invitation is expired', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(createJsonResponse(200, { user: consentedUser }))
        .mockResolvedValueOnce(createJsonResponse(400, { error: 'Invitation expired' }))
    );

    renderAcceptInvite(`/accept-invite/?token=${INVITE_TOKEN}`);

    expect(await screen.findByText('This invitation is invalid or has expired.')).toBeTruthy();
  });

  it('shows a home action when the server cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    renderAcceptInvite(`/accept-invite/?token=${INVITE_TOKEN}`);

    expect(
      await screen.findByText('We could not reach the server. Check your connection and try again.')
    ).toBeTruthy();
  });

  it('shows a home action when authentication fails for another reason', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createJsonResponse(500, { error: 'down' })));

    renderAcceptInvite(`/accept-invite/?token=${INVITE_TOKEN}`);

    expect(
      await screen.findByText(
        'Something went wrong while accepting this invitation. Please try again.'
      )
    ).toBeTruthy();
  });
});
