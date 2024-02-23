import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
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

import { PaginatedApiResponse } from '@/types/api';

export type ServerTableState = {
  globalFilter: string;
  pagination: PaginationState;
  sorting: SortingState;
};

type SetServerTableState = {
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

type ServerTableProps<T extends object> = {
  columns: ColumnDef<T>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popUpFilterProps?: Omit<PopupFilterProps<any, T>, 'table'>;
  isLoading: boolean;
  response: PaginatedApiResponse<T[]> | undefined;
  data: T[];
  tableState: ServerTableState;
  setTableState: SetServerTableState;
  omitSort?: boolean;
  withFilter?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

export default function ServerTable<T extends object>({
  className,
  columns,
  popUpFilterProps,
  isLoading,
  response,
  data,
  tableState,
  setTableState,
  omitSort = false,
  withFilter = false,
  ...rest
}: ServerTableProps<T>) {
  const lastPage = response
    ? Math.ceil(response.total / response.page_size)
    : 0;
  const table = useReactTable({
    data: data,
    columns,
    pageCount: lastPage,
    state: {
      ...tableState,
    },
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    onGlobalFilterChange: setTableState.setGlobalFilter,
    onPaginationChange: setTableState.setPagination,
    onSortingChange: setTableState.setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
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
            icon={<FiList />}
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
              <TBody table={table} isLoading={isLoading} />
            </table>
          </div>
        </div>
      </div>

      <PaginationControl table={table} data={data} className='mt-4' />
    </div>
  );
}
