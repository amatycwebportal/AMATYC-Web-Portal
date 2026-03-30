// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LocalLeadDashboard from '../LocalLeadDashboard';

vi.mock('../../../Middleware/auth', () => ({
  LocalLeaderAuthGuard: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('LocalLeadDashboard', () => {
  it('renders dashboard title and navigates when a card is activated', () => {
    render(
      <MemoryRouter initialEntries={['/admin/local-leader']}>
        <Routes>
          <Route path="/admin/local-leader" element={<LocalLeadDashboard />} />
          <Route
            path="/admin/local-leader/rubrics"
            element={<div data-testid="rubrics-destination">Rubrics</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /local leader dashboard/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /open rubrics/i }));

    expect(screen.getByTestId('rubrics-destination')).toBeTruthy();
  });

  it('navigates to consensus meeting route from the consensus card', () => {
    render(
      <MemoryRouter initialEntries={['/admin/local-leader']}>
        <Routes>
          <Route path="/admin/local-leader" element={<LocalLeadDashboard />} />
          <Route
            path="/admin/local-leader/consensus-meeting"
            element={<div data-testid="consensus-destination">Consensus</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /open consensus meeting/i }));

    expect(screen.getByTestId('consensus-destination')).toBeTruthy();
  });
});
