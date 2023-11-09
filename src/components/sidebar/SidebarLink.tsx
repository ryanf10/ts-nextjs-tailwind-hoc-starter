import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

type SidebarLinkProps = {
  isActive: boolean;
  children: React.ReactNode;
  href: string;
} & React.ComponentPropsWithRef<'a'>;
export default function SidebarLink({
  href,
  isActive,
  children,
  ...rest
}: SidebarLinkProps) {
  return (
    <Link
      {...rest}
      href={href}
      className={cn(
        'text-bodydark1 hover:bg-graydark dark:hover:bg-meta-4 group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out',
        isActive && 'bg-graydark dark:bg-meta-4',
        rest.className
      )}
    >
      {children}
    </Link>
  );
}
