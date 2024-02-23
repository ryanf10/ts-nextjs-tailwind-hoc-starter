import { Info } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/popover/Popover';

import { ExtractProps } from '@/types/helper';

type InfoPopoverProps = {
  children: React.ReactNode;
  classNames?: {
    content?: string;
    trigger?: string;
  };
} & ExtractProps<typeof Popover>;

export default function InfoPopover({
  classNames,
  children,
  ...rest
}: InfoPopoverProps) {
  return (
    <Popover {...rest}>
      <PopoverTrigger asChild>
        <IconButton
          variant='ghost'
          size='xs'
          className={cn(['text-typo-icons rounded-full', classNames?.trigger])}
          icon={Info}
        />
      </PopoverTrigger>
      <PopoverContent
        side='top'
        className={cn(['w-60 p-2', classNames?.content])}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
