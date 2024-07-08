import { InfiniteData } from '@tanstack/query-core';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import {
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import * as React from 'react';

import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import Filter from '@/components/table/Filter';
import PopupFilter, { PopupFilterProps } from '@/components/table/PopupFilter';

import { PaginatedApiResponse } from '@/types/api';

export type ServerInfiniteCardState = {
  globalFilter: string;
  pagination: PaginationState;
  sorting: SortingState;
};

type SetServerInfiniteCardState = {
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

type ServerInfiniteCardProps<T extends object> = {
  card: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popUpFilterProps?: Omit<PopupFilterProps<any, T>, 'table'>;
  isLoading: boolean;
  response: PaginatedApiResponse<T[]> | undefined;
  data: T[];
  tableState: ServerInfiniteCardState;
  setTableState: SetServerInfiniteCardState;
  withFilter?: boolean;
  infiniteResult: UseInfiniteQueryResult<
    InfiniteData<PaginatedApiResponse<T[]>>
  >;
} & React.ComponentPropsWithoutRef<'div'>;

export default function ServerInfiniteCard<T extends object>({
  card: Card,
  className,
  popUpFilterProps,
  isLoading,
  response,
  data,
  tableState,
  setTableState,
  withFilter = false,
  infiniteResult,
  ...rest
}: ServerInfiniteCardProps<T>) {
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

  const { hasNextPage, fetchNextPage } = infiniteResult;

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
        </div>
      </div>
      <div className='flex flex-col'>
        {isLoading ? 'Loading...' : data.length == 0 ? 'No entry found' : Card}
      </div>
      {hasNextPage && (
        <div className='mt-5 flex flex-row justify-center'>
          <Button
            variant='outline'
            size='sm'
            disabled={!hasNextPage}
            className='flex w-fit'
            onClick={() => fetchNextPage()}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
