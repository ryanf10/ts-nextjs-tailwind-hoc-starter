import { act, renderHook } from '@testing-library/react';

import useAuthStore from '@/store/useAuthStore';

jest.mock('@/lib/api/auth/logout', () => ({
  callLogout: jest.fn(),
}));

describe('AuthStore', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuthStore());
    const { user, role, isAuthenticated, isLoading } = result.current;

    expect(user).toBeNull();
    expect(role).toBeNull();
    expect(isAuthenticated).toBeFalsy();
    expect(isLoading).toBeTruthy();
  });

  it('should login and set user and role', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        roles: [{ id: '1', name: 'user' }],
        createdAt: '2024-03-15',
      });
    });

    const { user, role, isAuthenticated } = result.current;

    expect(user).toEqual({
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      roles: [{ id: '1', name: 'user' }],
      createdAt: '2024-03-15',
    });
    expect(role).toEqual({ id: '1', name: 'user' });
    expect(isAuthenticated).toBeTruthy();
  });

  it('should logout and clear user and role', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.logout();
    });

    const { user, role, isAuthenticated } = result.current;

    expect(user).toBeNull();
    expect(role).toBeNull();
    expect(isAuthenticated).toBeFalsy();
  });

  it('should stop loading', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.stopLoading();
    });

    const { isLoading } = result.current;

    expect(isLoading).toBeFalsy();
  });

  it('should switch role', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.switchRole({ id: '2', name: 'admin' });
    });

    const { role } = result.current;

    expect(role).toEqual({ id: '2', name: 'admin' });
  });
});
