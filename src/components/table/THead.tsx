import { flexRender, RowData, Table } from '@tanstack/react-table';
import * as React from 'react';
import { VscTriangleDown } from 'react-icons/vsc';

import { cn } from '@/lib/utils';

type THeadProps<T extends RowData> = {
  omitSort: boolean;
  table: Table<T>;
} & React.ComponentPropsWithoutRef<'div'>;

export default function THead<T extends RowData>({
  className,
  omitSort,
  table,
  ...rest
}: THeadProps<T>) {
  return (
    <thead
      className={cn(
        'font-averta border-b border-gray-200 bg-gray-50',
        className
      )}
      {...rest}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              scope='col'
              className={cn(
                'group py-3 pr-3 text-left text-base font-semibold capitalize',
                !omitSort && header.column.getCanSort() ? 'pl-4' : 'pl-[30px]'
              )}
            >
              {header.isPlaceholder ? null : (
                <div
                  className={cn(
                    'relative flex items-center gap-2 py-1',
                    !omitSort && header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : ''
                  )}
                  onClick={
                    omitSort
                      ? () => null
                      : header.column.getToggleSortingHandler()
                  }
                >
                  {!omitSort &&
                  header.column.getCanSort() &&
                  !header.column.getIsSorted() ? (
                    <VscTriangleDown className='group-hover:fill-typo-icons w-3 rotate-180 fill-transparent' />
                  ) : (
                    {
                      asc: (
                        <VscTriangleDown className='fill-primary-600 w-3 rotate-180' />
                      ),
                      desc: (
                        <VscTriangleDown className='fill-primary-600 w-3' />
                      ),
                    }[header.column.getIsSorted() as string] ?? null
                  )}
                  <p>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </p>
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
