import { UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import toast from 'react-hot-toast';

import { DEFAULT_TOAST_MESSAGE } from '@/constant/toast';

import { ApiError } from '@/types/api';

type OptionType = {
  loading?: string;
  success?: string;
  error?: string;
};

type MuteToastOption = {
  hideLoading?: boolean;
  hideSuccess?: boolean;
  hideError?: boolean;
};

export default function useMutationToast<T, K>(
  mutation: UseMutationResult<T, AxiosError<ApiError>, K>,
  customMessages: OptionType = {},
  muteToastOption: MuteToastOption = {
    hideLoading: false,
    hideSuccess: false,
    hideError: false,
  }
) {
  const { data, isError, isPending, error } = mutation;

  const toastStatus = React.useRef<string>(data ? 'done' : 'idle');

  React.useEffect(() => {
    const toastMessage = {
      ...DEFAULT_TOAST_MESSAGE,
      ...customMessages,
    };

    // If it is not the first render
    if (toastStatus.current === 'done' && !isPending) return;

    if (isError) {
      if (!muteToastOption.hideError) {
        toast.error(
          typeof toastMessage.error === 'string'
            ? toastMessage.error
            : toastMessage.error(error),
          {
            id: toastStatus.current,
          }
        );
      }
      toastStatus.current = 'done';
    } else if (isPending) {
      if (!muteToastOption.hideLoading) {
        toastStatus.current = toast.loading(toastMessage.loading);
      }
    } else if (data) {
      if (!muteToastOption.hideSuccess) {
        toast.success(toastMessage.success, { id: toastStatus.current });
      }
      toastStatus.current = 'done';
    }

    return () => {
      toast.dismiss(toastStatus.current);
    };
  }, [customMessages, data, error, isError, isPending, muteToastOption]);

  return { ...mutation };
}
