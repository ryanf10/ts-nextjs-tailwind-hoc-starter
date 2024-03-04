import Head from 'next/head';
import * as React from 'react';
import { FaGithub } from 'react-icons/fa';

import AuthButton from '@/components/buttons/AuthButton';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import Typography from '@/components/typography/Typography';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Logo from '~/svg/Logo.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <Logo className='w-16' />
          <h1 className='mt-4'>
            Next.js + Tailwind CSS + HOC Auth + TypeScript Starter
          </h1>
          <p className='mt-2 text-sm text-gray-800'>
            A starter for Next.js, Tailwind CSS, HOC Auth and TypeScript with
            Absolute Import, Seo, Link component, pre-configured with Husky{' '}
          </p>
          <p className='mt-2 text-sm text-gray-700'>
            <ArrowLink href='https://github.com/ryanf10/ts-nextjs-tailwind-hoc-starter'>
              See the repository
            </ArrowLink>
          </p>
          <ButtonLink className='mt-6' href='/components' variant='light'>
            See all components
          </ButtonLink>
          <div className='mt-5'>
            <AuthButton />
          </div>
          <div className='mt-6'>
            <Typography variant='h5'>Sandbox</Typography>
            <div className='mt-2 flex flex-wrap justify-center gap-2'>
              <ButtonLink
                href='/sandbox/components'
                className='mt-2'
                variant='outline'
              >
                Components
              </ButtonLink>
              <ButtonLink
                href='/sandbox/table'
                className='mt-2'
                variant='outline'
              >
                Table
              </ButtonLink>
            </div>
          </div>
          <div className='mt-6'>
            <Typography variant='h2'>Backend Dependency</Typography>
            <ButtonLink
              href='https://github.com/ryanf10/nestjs-auth-mongodb'
              className='mt-2'
              leftIcon={FaGithub}
            >
              NestJs JWT Authentication and Authorization with MongoDB
            </ButtonLink>
          </div>
          <div className='mt-6'>
            <Typography variant='h5'>Special Credits</Typography>
            <div>
              <ButtonLink
                href='https://github.com/theodorusclarence/ts-nextjs-tailwind-starter'
                className='mt-2'
                leftIcon={FaGithub}
                variant='light'
              >
                Next.js + Tailwind CSS + TypeScript
              </ButtonLink>
            </div>
            <div>
              <ButtonLink
                href='https://github.com/TailAdmin/free-nextjs-admin-dashboard'
                className='mt-2'
                leftIcon={FaGithub}
                variant='light'
              >
                TailAdmin
              </ButtonLink>
            </div>
          </div>
          <footer className='absolute bottom-2 text-gray-700'>
            © {new Date().getFullYear()} By{' '}
            <UnderlineLink href='https://theodorusclarence.com?ref=tsnextstarter'>
              Ryan Fernaldy
            </UnderlineLink>
          </footer>
        </div>
      </section>
    </main>
  );
}
