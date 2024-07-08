import {
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
import TOption from '@/components/table/TOption';

import { PaginatedApiResponse } from '@/types/api';

export type ServerCardState = {
  globalFilter: string;
  pagination: PaginationState;
  sorting: SortingState;
};

type SetServerCardState = {
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

type ServerCardProps<T extends object> = {
  card: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popUpFilterProps?: Omit<PopupFilterProps<any, T>, 'table'>;
  isLoading: boolean;
  response: PaginatedApiResponse<T[]> | undefined;
  data: T[];
  tableState: ServerCardState;
  setTableState: SetServerCardState;
  withFilter?: boolean;
  withOption?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

export default function ServerCard<T extends object>({
  card: Card,
  className,
  popUpFilterProps,
  isLoading,
  response,
  data,
  tableState,
  setTableState,
  withFilter = false,
  withOption = false,
  ...rest
}: ServerCardProps<T>) {
  const lastPage =
    response && response.page_size
      ? Math.ceil(response.total / response.page_size)
      : 0;
  const table = useReactTable({
    data: data,
    columns: [],
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
          {withOption && (
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
          )}
        </div>
      </div>
      <div className='flex flex-col'>
        {isLoading ? 'Loading...' : data.length == 0 ? 'No entry found' : Card}
      </div>

      <PaginationControl table={table} data={data} className='mt-4' />
    </div>
  );
}
