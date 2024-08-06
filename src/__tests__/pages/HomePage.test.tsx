// !STARTERCONF You should delete this page

import { render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';

import HomePage from '@/app/page';
jest.mock('@/components/hoc/withAuth');
describe('Homepage', () => {
  it('renders the Components', () => {
    // Set the initial url:
    mockRouter.push('/');

    render(<HomePage />);

    const heading = screen.getByText(/A starter for Next.js/i);

    expect(heading).toBeInTheDocument();
  });
});
