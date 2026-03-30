// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ProjectLeadDashboard from '../ProjectLeadDashboard';

vi.mock('../../../Middleware/auth', () => ({
  ProjectLeadAuthGuard: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('ProjectLeadDashboard', () => {
  it('renders dashboard title and navigates when the rubrics card is activated', () => {
    render(
      <MemoryRouter initialEntries={['/admin/project-lead']}>
        <Routes>
          <Route path="/admin/project-lead" element={<ProjectLeadDashboard />} />
          <Route
            path="/admin/project-lead/rubrics"
            element={<div data-testid="rubrics-destination">Rubrics</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /project lead dashboard/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /open rubrics/i }));

    expect(screen.getByTestId('rubrics-destination')).toBeTruthy();
  });

  it('navigates to institutions from the institutions card', () => {
    render(
      <MemoryRouter initialEntries={['/admin/project-lead']}>
        <Routes>
          <Route path="/admin/project-lead" element={<ProjectLeadDashboard />} />
          <Route
            path="/admin/institutions"
            element={<div data-testid="institutions-destination">Institutions</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /open institutions/i }));

    expect(screen.getByTestId('institutions-destination')).toBeTruthy();
  });
});
