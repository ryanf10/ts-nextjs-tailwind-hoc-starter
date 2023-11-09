import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

type SidebarLinkProps = {
  isActive: boolean;
  children: React.ReactNode;
  href: string;
} & React.ComponentPropsWithRef<'a'>;
export default function SidebarLinkGroupItem({
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
        'text-bodydark2 group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white',
        isActive && 'text-white',
        rest.className
      )}
    >
      {children}
    </Link>
  );
}
