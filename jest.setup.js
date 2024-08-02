/* eslint-disable no-undef */
import '@testing-library/jest-dom/extend-expect';

// Allow router mocks.

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('next/navigation', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useRouter } = require('next-router-mock');
  const usePathname = () => {
    const router = useRouter();
    return router.pathname;
  };

  const useSearchParams = () => {
    const router = useRouter();
    return new URLSearchParams(router.query);
  };

  return {
    useRouter,
    usePathname,
    useSearchParams,
  };
});

jest.mock('next/headers', () => {
  return {
    cookies: () => ({
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    }),
  };
});
