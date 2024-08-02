import { render, renderHook, screen, waitFor } from '@testing-library/react';

import api from '@/lib/axios';
import { getCookie } from '@/lib/cookie';

import useAuthStore from '@/store/useAuthStore';

import PrivatePage from '@/app/private/page';

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
    render(<PrivatePage />);
    await waitFor(() => {
      expect(screen.getByText('This is private')).toBeInTheDocument();
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
    render(<PrivatePage />);
    await waitFor(() => {
      expect(screen.getByText('Forbidden Access')).toBeInTheDocument();
    });
  });
});
