import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import * as React from 'react';

import { cn } from '@/lib/utils';

import Filter from '@/components/table/Filter';
import PopupFilter, { PopupFilterProps } from '@/components/table/PopupFilter';
import TBody from '@/components/table/TBody';
import THead from '@/components/table/THead';

type TableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popUpFilterProps?: Omit<PopupFilterProps<any, T>, 'table'>;
  omitSort?: boolean;
  withFilter?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

export default function Table<T extends object>({
  className,
  columns,
  popUpFilterProps,
  data,
  omitSort = false,
  withFilter = false,
  ...rest
}: TableProps<T>) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={cn('flex flex-col', className)} {...rest}>
      <div
        className={clsx(
          'flex flex-col items-stretch gap-3 sm:flex-row',
          withFilter ? 'sm:justify-between' : 'sm:justify-end'
        )}
      >
        {withFilter && <Filter table={table} />}
        {popUpFilterProps && (
          <PopupFilter
            table={table}
            filterOption={popUpFilterProps.filterOption}
            setFilterQuery={popUpFilterProps.setFilterQuery}
            title={popUpFilterProps.title}
            buttonClassname={popUpFilterProps.buttonClassname}
          />
        )}
      </div>
      <div className='-mx-4 -my-2 mt-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
          <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-300'>
              <THead table={table} omitSort={omitSort} />
              <TBody table={table} />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
