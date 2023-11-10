'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
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
import ToggleThemeButton from '@/components/buttons/ToggleThemeButton';
import Input from '@/components/forms/Input';
import PasswordInput from '@/components/forms/PasswordInput';
import withAuth from '@/components/hoc/withAuth';
import PrimaryLink from '@/components/links/PrimaryLink';
import NextImage from '@/components/NextImage';

import useAuthStore from '@/store/useAuthStore';

import { ApiResponse } from '@/types/api';

import AuthBanner from '~/svg/auth-banner.svg';
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
      <div className='grid h-fit md:grid-cols-2 md:border'>
        <div className='px-5 py-4 text-center'>
          <Link className='mb-5.5 inline-block' href='/'>
            <NextImage
              useSkeleton
              src='/favicon/android-chrome-192x192.png'
              width='192'
              height='192'
              alt='Icon'
            />
          </Link>

          <p className='2xl:px-20'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit suspendisse.
          </p>

          <span className='mt-16 inline-block'>
            <AuthBanner className='w-48 lg:w-96' />
          </span>
        </div>
        <div className='sm:p-12.5 xl:p-17.5 w-full p-4 md:border-l md:border-l-gray-300'>
          <span className='mb-1.5 block font-medium'>Start for free</span>
          <h2 className='sm:text-title-xl2 mb-9 text-2xl font-bold text-black dark:text-white'>
            Sign In to Template
          </h2>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleLogin)} className='space-y-3'>
              <Input
                label='Email'
                id='email'
                type='email'
                placeholder='Enter your email'
              />
              <PasswordInput
                label='Password'
                id='password'
                placeholder='Enter your password'
              />
              <div className=''>
                <Button
                  type='submit'
                  className='mt-5 flex w-full justify-center'
                >
                  Submit
                </Button>
              </div>
            </form>
          </FormProvider>
          <div className='mt-6 text-center'>
            <p>
              Don’t have any account?{' '}
              <PrimaryLink href='/register'>Sign Up</PrimaryLink>
            </p>
          </div>
          <div className='absolute right-3 top-3'>
            <ToggleThemeButton />
          </div>
        </div>
      </div>
    </>
  );
}
