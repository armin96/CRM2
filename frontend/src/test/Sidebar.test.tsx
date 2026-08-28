import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuthStore } from '../store/authStore';

describe('Sidebar Component', () => {
  it('renders logo, nav links and user details', () => {
    useAuthStore.getState().login('fake-token', {
      id: 1,
      email: 'recruiter@company.com',
      fullName: 'Jane Recruiter',
    });

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('MiniCRM')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Email Sequences')).toBeInTheDocument();
    expect(screen.getByText('Jane Recruiter')).toBeInTheDocument();
    expect(screen.getByText('recruiter@company.com')).toBeInTheDocument();
  });
});
