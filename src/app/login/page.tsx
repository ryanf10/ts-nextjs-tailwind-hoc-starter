import clsx from 'clsx';
import { Metadata } from 'next';

import FormLogin from '@/components/login/FormLogin';

export const metadata: Metadata = {
  title: 'Login',
  description: 'User signin',
};
export default function LoginPage() {
  return (
    <main>
      <section className={clsx('dark:bg-dark bg-white')}>
        <div
          className={clsx(
            'layout min-h-screen md:px-5 md:py-20',
            'text-black dark:text-white',
            'flex justify-start md:justify-center'
          )}
        >
          <FormLogin />
        </div>
      </section>
    </main>
  );
}
