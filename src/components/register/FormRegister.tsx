'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import { RegisterParam, useRegister } from '@/lib/api/auth/register';
import useMutationToast from '@/hooks/toast/useMutationToast';

import Button from '@/components/buttons/Button';
import ToggleThemeButton from '@/components/buttons/ToggleThemeButton';
import Input from '@/components/forms/Input';
import PasswordInput from '@/components/forms/PasswordInput';
import withAuth from '@/components/hoc/withAuth';
import PrimaryLink from '@/components/links/PrimaryLink';
import NextImage from '@/components/NextImage';

import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';

import AuthBanner from '~/svg/auth-banner.svg';

export default withAuth(FormRegister, 'auth');
function FormRegister() {
  const router = useRouter();
  const { mutate, isSuccess } = useMutationToast<
    ApiResponse<User>,
    RegisterParam
  >(useRegister());
  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit, watch } = methods;
  const handleRegister: SubmitHandler<FieldValues> = (data) => {
    mutate({
      email: data.email,
      username: data.username,
      password: data.password,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      router.push('/login');
    }
  }, [isSuccess, router]);

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
            Sign Up to Template
          </h2>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleRegister)} className='space-y-3'>
              <Input
                label='Email'
                id='email'
                type='email'
                placeholder='Enter your email'
                validation={{ required: 'This is required' }}
              />
              <Input
                label='Username'
                id='username'
                placeholder='Enter your username'
                validation={{
                  required: 'This is required',
                  maxLength: {
                    value: 12,
                    message: 'Username must be no longer than 12 characters',
                  },
                }}
                helperText='maximum 12 characters'
              />
              <PasswordInput
                label='Password'
                id='password'
                validation={{
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                }}
                placeholder='Enter your password'
              />
              <PasswordInput
                label='Confirm Password'
                id='confirm_password'
                validation={{
                  validate: (value: string) => {
                    if (watch('password') != value) {
                      return 'Your passwords do not match';
                    }
                  },
                }}
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
              Already have an account?{' '}
              <PrimaryLink href='/login'>Sign in</PrimaryLink>
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
