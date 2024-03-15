import '@testing-library/jest-dom/extend-expect';

// Allow router mocks.
// eslint-disable-next-line no-undef
jest.mock('next/router', () => require('next-router-mock'));

// eslint-disable-next-line no-undef
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

// eslint-disable-next-line no-undef
jest.mock('@/components/hoc/withAuth', () => {
  // eslint-disable-next-line no-undef
  return jest.fn().mockImplementation((Component) => Component);
});
