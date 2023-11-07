import clsx from 'clsx';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Join us now!',
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
        ></div>
      </section>
    </main>
  );
}
