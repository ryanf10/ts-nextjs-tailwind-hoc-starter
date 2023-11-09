'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import axios from '@/lib/axios';
import { getFromLocalStorage } from '@/lib/helper';

import TextButton from '@/components/buttons/TextButton';
import PageLoader from '@/components/loader/PageLoader';

import useAuthStore from '@/store/useAuthStore';

import { ApiResponse } from '@/types/api';
import { AuthUser } from '@/types/user';

export interface WithAuthProps {
  user: AuthUser;
}

const HOME_ROUTE = '/dashboard';
const LOGIN_ROUTE = '/login';

enum RouteRole {
  /**
   * For authentication pages
   * @example /login /register
   */
  auth,
  /**
   * Optional authentication
   * It doesn't push to login page if user is not authenticated
   */
  optional,
  /**
   * For all authenticated user
   * will push to login if user is not authenticated
   */
  all,
}

/**
 * Add role-based access control to a component
 *
 * @see https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/
 * @see https://github.com/mxthevs/nextjs-auth/blob/main/src/components/withAuth.tsx
 */
export default function withAuth<T extends WithAuthProps = WithAuthProps>(
  Component: React.ComponentType<T>,
  routeRole: keyof typeof RouteRole,
  allowedRoles?: Array<'admin' | 'user'>
) {
  const ComponentWithAuth = (props: Omit<T, keyof WithAuthProps>) => {
    const router = useRouter();
    const params = useSearchParams();
    const redirect = params.get('redirect');
    const pathName = usePathname();

    //#region  //*=========== STORE ===========
    const isAuthenticated = useAuthStore.useIsAuthenticated();
    const isLoading = useAuthStore.useIsLoading();
    const login = useAuthStore.useLogin();
    const logout = useAuthStore.useLogout();
    const stopLoading = useAuthStore.useStopLoading();
    const user = useAuthStore.useUser();
    const activeRole = useAuthStore.useRole();
    //#endregion  //*======== STORE ===========

    const checkAuth = React.useCallback(() => {
      const token = getFromLocalStorage('token');
      const roleId = getFromLocalStorage('role');
      if (!token) {
        isAuthenticated && logout();
        stopLoading();
        return;
      }
      const loadUser = async () => {
        try {
          const res = await axios.get<ApiResponse<AuthUser>>('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });

          let tempRole = res.data.data.roles[0];
          const roleItem = res.data.data.roles.find(
            (item) => item.id == roleId
          );
          if (roleItem) {
            tempRole = roleItem;
          }

          login(
            {
              ...res.data.data,
              token: token + '',
            },
            tempRole
          );
        } catch (err) {
          localStorage.removeItem('token');
        } finally {
          stopLoading();
        }
      };

      if (!isAuthenticated) {
        loadUser();
      }
    }, [isAuthenticated, login, logout, stopLoading]);

    React.useEffect(() => {
      // run checkAuth every page visit
      checkAuth();

      // run checkAuth every focus changes
      window.addEventListener('focus', checkAuth);
      return () => {
        window.removeEventListener('focus', checkAuth);
      };
    }, [checkAuth]);

    React.useEffect(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          // Prevent authenticated user from accessing auth or other role pages
          if (routeRole === 'auth') {
            if (redirect) {
              router.replace(redirect as string);
            } else {
              router.replace(HOME_ROUTE);
            }
          }
        } else {
          // Prevent unauthenticated user from accessing protected pages
          if (routeRole !== 'auth' && routeRole !== 'optional') {
            router.replace(`${LOGIN_ROUTE}?redirect=${pathName}`);
          }
        }
      }
    }, [isAuthenticated, isLoading, redirect, router, user, pathName]);

    if (!isLoading && isAuthenticated && routeRole == 'all') {
      if (allowedRoles) {
        const find = allowedRoles.some(
          (allowedRole) => allowedRole == activeRole?.name
        );
        if (!find) {
          return (
            <main>
              <section className='bg-white'>
                <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
                  <RiAlarmWarningFill
                    size={60}
                    className='drop-shadow-glow animate-flicker text-red-500'
                  />
                  <h1 className='mt-8 text-4xl md:text-6xl'>
                    Oops, something went wrong!
                  </h1>
                  <TextButton variant='basic' className='mt-4'>
                    Forbidden Access
                  </TextButton>
                </div>
              </section>
            </main>
          );
        }
      }
    }

    if (
      // If unauthenticated user want to access protected pages
      (isLoading || !isAuthenticated) &&
      // auth pages and optional pages are allowed to access without login
      routeRole !== 'auth' &&
      routeRole !== 'optional'
    ) {
      return <PageLoader />;
    }

    return <Component {...(props as T)} user={user} />;
  };

  return ComponentWithAuth;
}
