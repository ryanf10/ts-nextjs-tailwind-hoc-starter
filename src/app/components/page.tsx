'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import {
  ArrowRight,
  CreditCard,
  Laptop,
  Phone,
  Plus,
  Shield,
} from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

import apiMock, { mockQuery } from '@/lib/axios-mock';
import logger from '@/lib/logger';
import useMutationToast from '@/hooks/toast/useMutationToast';
import useQueryToast from '@/hooks/toast/useQueryToast';
import useDialog from '@/hooks/useDialog';

import Alert from '@/components/alert/Alert';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import TextButton from '@/components/buttons/TextButton';
import ToggleThemeButton from '@/components/buttons/ToggleThemeButton';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import PrimaryLink from '@/components/links/PrimaryLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';
import Skeleton from '@/components/Skeleton';
import Typography from '@/components/typography/Typography';

import { ApiError, ApiResponse } from '@/types/api';

type Color = (typeof colorList)[number];

type User = {
  id: number;
  name: string;
  token: string;
};

type LoginData = {
  email: string;
  password: string;
};
export default function ComponentPage() {
  const [color, setColor] = React.useState<Color>('sky');
  const dialog = useDialog();

  const openSuccess = () => {
    dialog({
      title: 'Success title',
      description: 'Success description whatever you want',
      submitText: 'Hurray',
      variant: 'success',
      catchOnCancel: true,
    })
      .then(() => logger('accept'))
      .catch(() => logger('reject'));
  };

  const openWarning = () => {
    dialog({
      title: 'Warning title !!!',
      description: 'Warning description whatever you want',
      submitText: 'Sure',
      variant: 'warning',
      catchOnCancel: true,
    })
      .then(() => logger('accept'))
      .catch(() => logger('reject'));
  };
  const openDanger = () => {
    dialog({
      title: "Danger action! Don't do it",
      description: 'Danger description, are you sure?',
      submitText: 'Do it',
      variant: 'danger',
      catchOnCancel: true,
    })
      .then(() => logger('accept'))
      .catch(() => logger('reject'));
  };

  const openNested = () => {
    dialog({
      title: 'Warning title !!!',
      description: 'Warning description whatever you want',
      submitText: 'Sure',
      variant: 'warning',
      catchOnCancel: true,
    })
      .then(() => {
        logger('accept');
        openDanger();
      })
      .catch(() => logger('reject'));
  };

  const {
    data: mutationData,
    isLoading,
    mutate,
  } = useMutationToast<ApiResponse<undefined>, LoginData>(
    useMutation((data) => apiMock.post('/login', data).then((res) => res.data))
  );

  const { data: queryData } = useQueryToast(
    useQuery<ApiResponse<User>, AxiosError<ApiError>>(['/me'], mockQuery)
  );
  return (
    <main>
      <section className={clsx('dark:bg-dark bg-white', color)}>
        <div
          className={clsx(
            'layout min-h-screen py-20',
            'text-black dark:text-white'
          )}
        >
          <h1>Built-in Components</h1>
          <ArrowLink direction='left' className='mt-2' href='/'>
            Back to Home
          </ArrowLink>

          <div className='mt-8 flex flex-wrap gap-2'>
            <ToggleThemeButton />
            {/* <Button onClick={randomize}>Randomize CSS Variable</Button> */}
          </div>

          <ol className='mt-8 space-y-6'>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>Customize Colors</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                You can change primary color to any Tailwind CSS colors. See
                globals.css to change your color.
              </p>
              <div className='flex flex-wrap gap-2'>
                <select
                  name='color'
                  id='color'
                  value={color}
                  className={clsx(
                    'block max-w-xs rounded',
                    'dark:bg-dark border-gray-300 bg-white dark:border dark:border-gray-600',
                    'focus:border-primary-400 focus:ring-primary-400 focus:outline-none focus:ring'
                  )}
                  onChange={(e) => setColor(e.target.value as Color)}
                >
                  {colorList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ButtonLink href='https://github.com/theodorusclarence/ts-nextjs-tailwind-starter/blob/main/src/styles/colors.css'>
                  Check list of colors
                </ButtonLink>
              </div>
              <div className='flex flex-wrap gap-2 text-xs font-medium'>
                <div className='bg-primary-50 flex h-10 w-10 items-center justify-center rounded text-black'>
                  50
                </div>
                <div className='bg-primary-100 flex h-10 w-10 items-center justify-center rounded text-black'>
                  100
                </div>
                <div className='bg-primary-200 flex h-10 w-10 items-center justify-center rounded text-black'>
                  200
                </div>
                <div className='bg-primary-300 flex h-10 w-10 items-center justify-center rounded text-black'>
                  300
                </div>
                <div className='bg-primary-400 flex h-10 w-10 items-center justify-center rounded text-black'>
                  400
                </div>
                <div className='bg-primary-500 flex h-10 w-10 items-center justify-center rounded text-black'>
                  500
                </div>
                <div className='bg-primary-600 flex h-10 w-10 items-center justify-center rounded text-white'>
                  600
                </div>
                <div className='bg-primary-700 flex h-10 w-10 items-center justify-center rounded text-white'>
                  700
                </div>
                <div className='bg-primary-800 flex h-10 w-10 items-center justify-center rounded text-white'>
                  800
                </div>
                <div className='bg-primary-900 flex h-10 w-10 items-center justify-center rounded text-white'>
                  900
                </div>
                <div className='bg-primary-950 flex h-10 w-10 items-center justify-center rounded text-white'>
                  950
                </div>
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>UnstyledLink</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                No style applied, differentiate internal and outside links, give
                custom cursor for outside links.
              </p>
              <div className='space-x-2'>
                <UnstyledLink href='/'>Internal Links</UnstyledLink>
                <UnstyledLink href='https://theodorusclarence.com'>
                  Outside Links
                </UnstyledLink>
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>PrimaryLink</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Add styling on top of UnstyledLink, giving a primary color to
                the link.
              </p>
              <div className='space-x-2'>
                <PrimaryLink href='/'>Internal Links</PrimaryLink>
                <PrimaryLink href='https://theodorusclarence.com'>
                  Outside Links
                </PrimaryLink>
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>UnderlineLink</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Add styling on top of UnstyledLink, giving a dotted and animated
                underline.
              </p>
              <div className='space-x-2'>
                <UnderlineLink href='/'>Internal Links</UnderlineLink>
                <UnderlineLink href='https://theodorusclarence.com'>
                  Outside Links
                </UnderlineLink>
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>ArrowLink</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Useful for indicating navigation, I use this quite a lot, so why
                not build a component with some whimsy touch?
              </p>
              <div className='flex flex-wrap items-center gap-4'>
                <ArrowLink href='/' direction='left'>
                  Direction Left
                </ArrowLink>
                <ArrowLink href='/'>Direction Right</ArrowLink>
                <ArrowLink
                  as={UnstyledLink}
                  className='inline-flex items-center'
                  href='/'
                >
                  Polymorphic
                </ArrowLink>
                <ArrowLink
                  as={ButtonLink}
                  variant='light'
                  className='inline-flex items-center'
                  href='/'
                >
                  Polymorphic
                </ArrowLink>
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>ButtonLink</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Button styled link with 3 variants.
              </p>
              <div className='flex flex-wrap gap-2'>
                <ButtonLink
                  variant='primary'
                  href='https://theodorusclarence.com'
                >
                  Primary Variant
                </ButtonLink>
                <ButtonLink
                  variant='outline'
                  href='https://theodorusclarence.com'
                >
                  Outline Variant
                </ButtonLink>
                <ButtonLink
                  variant='ghost'
                  href='https://theodorusclarence.com'
                >
                  Ghost Variant
                </ButtonLink>
                <ButtonLink variant='dark' href='https://theodorusclarence.com'>
                  Dark Variant
                </ButtonLink>
                <ButtonLink
                  variant='light'
                  href='https://theodorusclarence.com'
                >
                  Light Variant
                </ButtonLink>
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>Button</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Ordinary button with style.
              </p>
              <div className='flex flex-wrap gap-2'>
                <Button variant='primary'>Primary Variant</Button>
                <Button variant='outline'>Outline Variant</Button>
                <Button variant='ghost'>Ghost Variant</Button>
                <Button variant='dark'>Dark Variant</Button>
                <Button variant='light'>Light Variant</Button>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant='primary'
                  leftIcon={Plus}
                  rightIcon={ArrowRight}
                >
                  Icon
                </Button>
                <Button
                  variant='outline'
                  leftIcon={Plus}
                  rightIcon={ArrowRight}
                >
                  Icon
                </Button>
                <Button variant='ghost' leftIcon={Plus} rightIcon={ArrowRight}>
                  Icon
                </Button>
                <Button variant='dark' leftIcon={Plus} rightIcon={ArrowRight}>
                  Icon
                </Button>
                <Button variant='light' leftIcon={Plus} rightIcon={ArrowRight}>
                  Icon
                </Button>
              </div>
              <div className='!mt-4 flex flex-wrap gap-2'>
                <Button size='sm' variant='primary'>
                  Small Size
                </Button>
                <Button size='sm' variant='outline'>
                  Small Size
                </Button>
                <Button size='sm' variant='ghost'>
                  Small Size
                </Button>
                <Button size='sm' variant='dark'>
                  Small Size
                </Button>
                <Button size='sm' variant='light'>
                  Small Size
                </Button>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Button
                  size='sm'
                  variant='primary'
                  leftIcon={Plus}
                  rightIcon={ArrowRight}
                >
                  Icon
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  leftIcon={Plus}
                  rightIcon={ArrowRight}
                >
                  Icon
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  leftIcon={Plus}
                  rightIcon={ArrowRight}
                >
                  Icon
                </Button>

                <Button
                  size='sm'
                  variant='dark'
                  leftIcon={Plus}
                  rightIcon={ArrowRight}
                >
                  Icon
                </Button>
                <Button
                  size='sm'
                  variant='light'
                  leftIcon={Plus}
                  rightIcon={ArrowRight}
                >
                  Icon
                </Button>
              </div>

              <div className='!mt-4 flex flex-wrap gap-2'>
                <Button disabled variant='primary'>
                  Disabled
                </Button>
                <Button disabled variant='outline'>
                  Disabled
                </Button>
                <Button disabled variant='ghost'>
                  Disabled
                </Button>
                <Button disabled variant='dark'>
                  Disabled
                </Button>
                <Button disabled variant='light'>
                  Disabled
                </Button>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Button isLoading variant='primary'>
                  Disabled
                </Button>
                <Button isLoading variant='outline'>
                  Disabled
                </Button>
                <Button isLoading variant='ghost'>
                  Disabled
                </Button>
                <Button isLoading variant='dark'>
                  Disabled
                </Button>
                <Button isLoading variant='light'>
                  Disabled
                </Button>
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>TextButton</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Button with a text style
              </p>
              <div className='space-x-2'>
                <TextButton>Primary Variant</TextButton>
                <TextButton variant='basic'>Basic Variant</TextButton>
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>IconButton</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Button with only icon inside
              </p>
              <div className='space-x-2'>
                <IconButton icon={Plus} />
                <IconButton variant='outline' icon={Laptop} />
                <IconButton variant='ghost' icon={Phone} />
                <IconButton variant='dark' icon={Shield} />
                <IconButton variant='light' icon={CreditCard} />
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>Custom 404 Page</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Styled 404 page with some animation.
              </p>
              <div className='flex flex-wrap gap-2'>
                <ButtonLink href='/404'>Visit the 404 page</ButtonLink>
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>Next Image</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Next Image with default props and skeleton animation
              </p>
              <NextImage
                useSkeleton
                className='w-32 md:w-40'
                src='/favicon/android-chrome-192x192.png'
                width='180'
                height='180'
                alt='Icon'
              />
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>Skeleton</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Skeleton with shimmer effect
              </p>
              <Skeleton className='h-72 w-72' />
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>Alert</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Alert Variant
              </p>
              <Alert>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit,
                velit.
              </Alert>
              <Alert variant='secondary'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit,
                velit.
              </Alert>
              <Alert variant='danger'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit,
                velit.
              </Alert>
              <Alert variant='warning'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit,
                velit.
              </Alert>
              <Alert variant='success'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quaerat, maiores pariatur eaque laboriosam voluptates est cum
                repudiandae facilis ipsam doloribus porro, dolore fugit officiis
                sequi neque possimus. Ipsa, expedita possimus!
              </Alert>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>Dialog</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Dialog Variant
              </p>
              <div className='flex flex-col items-start space-y-3'>
                <Button onClick={openSuccess}>Success Alert</Button>
                <Button onClick={openWarning}>Warning Alert</Button>
                <Button onClick={openDanger}>Danger Alert</Button>
                <Button onClick={openNested}>Nested Dialog</Button>
              </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>Toast</h2>
              <p
                className={clsx(
                  '!mt-1 text-sm',
                  'text-gray-600 dark:text-gray-300'
                )}
              >
                Toast Variant
              </p>
              <div className='flex flex-col items-start space-y-3'>
                <div className='mt-4 flex flex-wrap gap-3'>
                  <Button onClick={() => toast.success('Hello!')}>
                    Success
                  </Button>
                  <Button
                    onClick={() => toast.error('Oops! Something went wrong')}
                  >
                    Error
                  </Button>
                  <Button
                    onClick={() =>
                      toast.loading('Loading...', {
                        duration: 4000,
                      })
                    }
                  >
                    Loading
                  </Button>
                </div>
                <div className='mt-8 space-y-3'>
                  <Button
                    isLoading={isLoading}
                    onClick={() =>
                      mutate({ email: 'admin@mail.com', password: 'admin' })
                    }
                  >
                    Promise
                  </Button>
                  <Typography variant='h2' as='h2'>
                    Query:
                  </Typography>
                  {queryData && <pre>{JSON.stringify(queryData, null, 2)}</pre>}
                  <Typography variant='h2' as='h2'>
                    Mutation:
                  </Typography>
                  {mutationData && (
                    <pre>{JSON.stringify(mutationData, null, 2)}</pre>
                  )}
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}

const colorList = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
] as const;
