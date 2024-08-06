import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  queryByAttribute,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import mockRouter from 'next-router-mock';

import Layout from '@/components/layout/Layout';

import useAuthStore from '@/store/useAuthStore';

import ProfilePage from '@/app/profile/page';

jest.mock('@/components/hoc/withAuth');
describe('Profile', () => {
  it('renders the Components', () => {
    const queryClient = new QueryClient();
    // Set the initial url:
    mockRouter.push('/');

    const { result } = renderHook(() => useAuthStore());
    const { login } = result.current;
    act(() => {
      login({
        id: '1',
        username: 'user 1',
        email: 'user@yopmail.com',
        roles: [
          { id: '1', name: 'user' },
          { id: '2', name: 'admin' },
        ],
        createdAt: new Date().getTime().toString(),
      });
    });
    render(
      <QueryClientProvider client={queryClient}>
        <Layout>
          <ProfilePage />
        </Layout>
      </QueryClientProvider>
    );

    const username = screen.getAllByText(/user 1/i);
    expect(username).toHaveLength(2);

    // const role = screen.getByText((content, element) => {
    //   return element?.id.toLowerCase() == 'role' && content == 'user';
    // });
    // expect(role).toBeInTheDocument();
  });

  it('can change role', () => {
    const queryClient = new QueryClient();
    // Set the initial url:
    mockRouter.push('/');

    const { result } = renderHook(() => useAuthStore());
    const { login } = result.current;
    act(() => {
      login({
        id: '1',
        username: 'user 1',
        email: 'user@yopmail.com',
        roles: [
          { id: '1', name: 'user' },
          { id: '2', name: 'admin' },
        ],
        createdAt: new Date().getTime().toString(),
      });
    });
    const dom = render(
      <QueryClientProvider client={queryClient}>
        <Layout>
          <ProfilePage />
        </Layout>
      </QueryClientProvider>
    );
    const getById = queryByAttribute.bind(null, 'id');
    const button = getById(dom.container, 'change_role_to_admin');

    if (button) {
      fireEvent.click(button);
      const role = screen.getByText((content, element) => {
        return element?.id.toLowerCase() == 'role' && content == 'admin';
      });
      expect(role).toBeInTheDocument();
    }
  });
});
