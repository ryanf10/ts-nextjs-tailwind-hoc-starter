'use client';
import { useEffect } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import { useGetProfile } from '@/lib/api/auth/get-profile';
import { LoginParam, useLogin } from '@/lib/api/auth/login';
import useMutationToast from '@/hooks/toast/useMutationToast';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import PasswordInput from '@/components/forms/PasswordInput';
import withAuth from '@/components/hoc/withAuth';

import useAuthStore from '@/store/useAuthStore';

import { ApiResponse } from '@/types/api';
export default withAuth(FormLogin, 'auth');
function FormLogin() {
  const login = useAuthStore.useLogin();
  const { data: mutationData, mutate } = useMutationToast<
    ApiResponse<{ token: { access_token?: string } }>,
    LoginParam
  >(useLogin());
  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit } = methods;
  const handleLogin: SubmitHandler<FieldValues> = (data) => {
    mutate({ email: data.email, password: data.password });
  };
  const token = mutationData?.data.token.access_token;
  const fetchProfile = useGetProfile(token);

  useEffect(() => {
    if (token && fetchProfile.isSuccess) {
      login({
        ...fetchProfile.data.data,
        token: token,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, fetchProfile.isSuccess]);

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className='max-w-sm space-y-3'
        >
          <Input label='Email' id='email' type='email' placeholder='email' />
          <PasswordInput
            label='Password'
            id='password'
            placeholder='password'
          />
          <div className='text-center'>
            <Button type='submit' className='mt-5'>
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
