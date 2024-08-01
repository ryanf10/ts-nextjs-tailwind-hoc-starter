import { fireEvent, render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';

import ToggleThemeButton from '@/components/buttons/ToggleThemeButton';
// Mock the useTheme hook
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));
describe('ToggleThemeButton', () => {
  it('should change to dark', () => {
    const setThemeMock = jest.fn();
    // Mock implementation for useTheme
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: 'light', // Initial theme
      setTheme: setThemeMock, // Mock function
    });

    render(
      <>
        <ToggleThemeButton />
      </>
    );

    // Query for the checkbox input
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Verify setTheme was called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('should change to light', () => {
    const setThemeMock = jest.fn();
    // Mock implementation for useTheme
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: 'dark', // Initial theme
      setTheme: setThemeMock, // Mock function
    });

    render(
      <>
        <ToggleThemeButton />
      </>
    );

    // Query for the checkbox input
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Verify setTheme was called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
