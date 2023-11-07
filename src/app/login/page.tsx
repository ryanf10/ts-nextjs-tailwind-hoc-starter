import clsx from 'clsx';
import { Metadata } from 'next';

import FormLogin from '@/components/login/FormLogin';

export const metadata: Metadata = {
  title: 'Login',
  description: 'User signin',
};
export default function RegisterPage() {
  return (
    <main>
      <section className={clsx('dark:bg-dark bg-white')}>
        <div
          className={clsx(
            'layout min-h-screen py-20',
            'text-black dark:text-white'
          )}
        >
          <FormLogin />
        </div>
      </section>
    </main>
  );
}
