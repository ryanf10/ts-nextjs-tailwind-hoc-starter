export const DEFAULT_TOAST_MESSAGE = {
  loading: 'Loading...',
  success: 'Success',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (err: any) =>
    err?.response?.data?.messages?.length > 0
      ? err?.response?.data?.messages?.[0]['errors'][0]
      : err?.response?.data?.message ?? 'Something is wrong, please try again',
};
