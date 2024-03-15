import { act, render, renderHook, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';

import useAuthStore from '@/store/useAuthStore';

import Dashboard from '@/app/dashboard/page';

describe('Dashboard', () => {
  it('renders the Components', () => {
    // Set the initial url:
    mockRouter.push('/');

    const { result } = renderHook(() => useAuthStore());
    const { login } = result.current;
    act(() => {
      login({
        id: '1',
        username: 'user',
        email: 'user@yopmail.com',
        roles: [{ id: '1', name: 'user' }],
        createdAt: new Date().getTime().toString(),
      });
    });
    render(<Dashboard />);
    const heading = screen.getByText(`Welcome user@yopmail.com`);

    expect(heading).toBeInTheDocument();
  });
});
