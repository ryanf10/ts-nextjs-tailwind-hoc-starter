// !STARTERCONF You should delete this page

import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      redirect: (_: string): void => {},
    };
  },
  useSearchParams() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      get: () => null,
    };
  },
  usePathname() {
    return 'abc';
  },
}));
describe('Homepage', () => {
  it('renders the Components', () => {
    render(<HomePage />);

    const heading = screen.getByText(/A starter for Next.js/i);

    expect(heading).toBeInTheDocument();
  });
});
