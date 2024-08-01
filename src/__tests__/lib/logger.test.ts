/* eslint-disable no-console */
import logger from '@/lib/logger';

describe('logger', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should log when showLogger is true', () => {
    process.env.NEXT_PUBLIC_SHOW_LOGGER = 'true';

    const logMessage = { key: 'value' };
    const comment = 'Test comment';

    // Call logger
    logger(logMessage, comment);

    // Verify console.log was called with expected arguments
    expect(console.log).toHaveBeenCalledWith(
      '%c ============== INFO LOG \n',
      'color: #22D3EE',
      `${typeof window !== 'undefined' && window?.location.pathname}\n`,
      `=== ${comment}\n`,
      logMessage
    );
  });

  it('should not log when showLogger is false', () => {
    process.env.NEXT_PUBLIC_SHOW_LOGGER = 'false';

    const logMessage = { key: 'value' };

    logger(logMessage);
    expect(console.log).not.toBeCalled();
  });
});
