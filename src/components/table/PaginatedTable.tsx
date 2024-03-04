import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import * as React from 'react';
import { FiList } from 'react-icons/fi';

import { cn } from '@/lib/utils';

import Filter from '@/components/table/Filter';
import PaginationControl from '@/components/table/PaginationControl';
import PopupFilter, { PopupFilterProps } from '@/components/table/PopupFilter';
import TBody from '@/components/table/TBody';
import THead from '@/components/table/THead';
import TOption from '@/components/table/TOption';

type PaginatedTableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popUpFilterProps?: Omit<PopupFilterProps<any, T>, 'table'>;
  pageSize?: number;
  omitSort?: boolean;
  withFilter?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

export default function PaginatedTable<T extends object>({
  className,
  columns,
  popUpFilterProps,
  data,
  pageSize = 10,
  omitSort = false,
  withFilter = false,
  ...rest
}: PaginatedTableProps<T>) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize,
      },
    },
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={cn('flex flex-col', className)} {...rest}>
      <pre>
        {JSON.stringify(
          {
            globalFilter: table.getState().globalFilter,
            pagination: table.getState().pagination,
            sorting: table.getState().sorting,
          },
          null,
          2
        )}
      </pre>

      <div
        className={clsx(
          'flex flex-col items-stretch gap-3 sm:flex-row',
          withFilter ? 'sm:justify-between' : 'sm:justify-end'
        )}
      >
        {withFilter && <Filter table={table} />}
        <div className='flex items-center gap-3'>
          {popUpFilterProps && (
            <PopupFilter
              table={table}
              filterOption={popUpFilterProps.filterOption}
              setFilterQuery={popUpFilterProps.setFilterQuery}
              title={popUpFilterProps.title}
              buttonClassname={popUpFilterProps.buttonClassname}
            />
          )}
          <TOption
            icon={<FiList className='text-typo-secondary' />}
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 25].map((page) => (
              <option key={page} value={page}>
                {page} Entries
              </option>
            ))}
          </TOption>
        </div>
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

      <PaginationControl table={table} data={data} className='mt-4' />
    </div>
  );
}
