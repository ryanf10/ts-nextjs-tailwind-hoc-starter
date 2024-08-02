import { render, renderHook, screen, waitFor } from '@testing-library/react';

import api from '@/lib/axios';
import { getCookie } from '@/lib/cookie';

import withAuth from '@/components/hoc/withAuth';

import useAuthStore from '@/store/useAuthStore';

// Mock getCookie
jest.mock('@/lib/cookie', () => ({
  getCookie: jest.fn(),
  deleteCookie: jest.requireActual('@/lib/cookie').deleteCookie,
}));

describe('PrivatePage', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore());
    waitFor(() => result.current.reset());
    jest.restoreAllMocks();
  });

  it('renders the component for admin role', async () => {
    // Set up the mock return value for getCookie
    const mockCookieValue = 'mockedTokenValue';
    (getCookie as jest.Mock).mockResolvedValue(mockCookieValue);

    // Mock the Axios GET Profile request
    jest.spyOn(api, 'get').mockResolvedValue({
      data: {
        statusCode: 200,
        data: {
          id: '1',
          username: 'adminUser',
          email: 'admin@yopmail.com',
          roles: [{ id: '1', name: 'admin' }],
          createdAt: new Date().getTime().toString(),
        },
      },
    });

    // Render the component and wait for loading to complete
    const Component = () => <h1>Admin Only</h1>;
    const WrappedComponent = withAuth(Component, 'all', ['admin']);
    render(<WrappedComponent />);
    await waitFor(() => {
      expect(screen.getByText('Admin Only')).toBeInTheDocument();
    });
  });

  it('renders forbidden access for other role', async () => {
    // Set up the mock return value for getCookie
    const mockCookieValue = 'mockedTokenValue';
    (getCookie as jest.Mock).mockResolvedValue(mockCookieValue);

    // Mock the Axios GET Profile request
    jest.spyOn(api, 'get').mockResolvedValue({
      data: {
        statusCode: 200,
        data: {
          id: '1',
          username: 'userUser',
          email: 'user@yopmail.com',
          roles: [{ id: '1', name: 'user' }],
          createdAt: new Date().getTime().toString(),
        },
      },
    });
    // Render the component and wait for loading to complete
    const Component = () => <h1>Admin Only</h1>;
    const WrappedComponent = withAuth(Component, 'all', ['admin']);
    render(<WrappedComponent />);
    await waitFor(() => {
      expect(screen.queryByText('Admin Only')).toBeNull();
      expect(screen.getByText('Forbidden Access')).toBeInTheDocument();
    });
  });
});
