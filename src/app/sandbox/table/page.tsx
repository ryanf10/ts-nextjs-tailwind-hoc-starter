'use client';

import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import { Eye } from 'lucide-react';
import React, { useState } from 'react';

import { mockQuery } from '@/lib/axios-mock';
import { buildPaginatedTableURL } from '@/lib/table';
import { cn } from '@/lib/utils';
import useQueryToast from '@/hooks/toast/useQueryToast';
import useServerTable from '@/hooks/useServerTable';

import IconButton from '@/components/buttons/IconButton';
import ToggleThemeButton from '@/components/buttons/ToggleThemeButton';
import ArrowLink from '@/components/links/ArrowLink';
import PaginatedTable from '@/components/table/PaginatedTable';
import { PopupFilterProps } from '@/components/table/PopupFilter';
import ServerTable from '@/components/table/ServerTable';
import Table from '@/components/table/Table';
import Typography from '@/components/typography/Typography';

import { MockUser } from '@/app/api/mock/users/route';

import { ApiError, PaginatedApiResponse } from '@/types/api';
import { User } from '@/types/user';

export default function ComponentPage() {
  const { tableState, setTableState } = useServerTable<MockUser>();

  const columns: ColumnDef<MockUser>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      // To set size, add size in pixel
      size: 200,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
    {
      id: 'actions',
      header: 'Action',
      cell: () => <IconButton variant='outline' icon={Eye} />,
    },
  ];

  const [filterQuery, setFilterQuery] = useState<{ country: string[] }>({
    country: [],
  });
  const filterOption: PopupFilterProps<
    { country: string[] },
    User
  >['filterOption'] = React.useMemo(
    () => [
      {
        id: 'country',
        name: 'country',
        options: [
          { id: 'Indonesia', name: 'Indonesia' },
          { id: 'Malaysia', name: 'Malaysia' },
          { id: 'Singapore', name: 'Singapore' },
        ],
      },
    ],
    []
  );

  const url = buildPaginatedTableURL({
    baseUrl: '/users',
    tableState,
    additionalParam: {
      country: filterQuery.country,
    },
  });

  const { data, isPending } = useQueryToast(
    useQuery<PaginatedApiResponse<Array<MockUser>>, AxiosError<ApiError>>({
      queryKey: [url],
      queryFn: mockQuery,
      // staleTime: Infinity, // for keeping fetched page data
    }),
    {},
    { hideSuccess: true }
  );

  const [filterQueryPaginatedTable, setFilterQueryPaginatedTable] = useState<{
    country: string[];
  }>({
    country: [],
  });
  const filterOptionPaginatedTable: PopupFilterProps<
    { country: string[] },
    User
  >['filterOption'] = React.useMemo(
    () => [
      {
        id: 'country',
        name: 'country',
        options: [
          { id: 'Indonesia', name: 'Indonesia' },
          { id: 'Malaysia', name: 'Malaysia' },
          { id: 'Singapore', name: 'Singapore' },
        ],
      },
    ],
    []
  );

  const { data: unpaginatedData } = useQueryToast(
    useQuery<PaginatedApiResponse<MockUser[]>, AxiosError<ApiError>>({
      queryKey: ['/users'],
      queryFn: mockQuery,
      staleTime: Infinity, // for keeping fetched page data
    }),
    {},
    { hideSuccess: true }
  );

  //#endregion  //*======== Fetch Data ===========

  const filterData = (data: Array<MockUser>) => {
    if (filterQueryPaginatedTable.country.length > 0) {
      return data.filter((user) =>
        filterQueryPaginatedTable.country.some((filter) =>
          filter.includes(user.country)
        )
      );
    }
    return data;
  };

  return (
    <main>
      <section className={clsx('dark:bg-dark bg-white dark:text-gray-300')}>
        <div
          className={clsx(
            'layout min-h-screen py-20',
            'text-black dark:text-white'
          )}
        >
          <h1>Built-in Table</h1>
          <ArrowLink direction='left' className='mt-2' href='/'>
            Back to Home
          </ArrowLink>

          <div className='mt-8 flex flex-wrap gap-2'>
            <ToggleThemeButton />
            {/* <Button onClick={randomize}>Randomize CSS Variable</Button> */}
          </div>

          <div>
            <Typography as='h1' variant='h1' className='dark:text-gray-300'>
              Table
            </Typography>

            <Typography
              as='h2'
              variant='h2'
              className='mt-4 dark:text-gray-300'
            >
              Server Table
            </Typography>
            <Typography variant='b2' className='dark:text-gray-300'>
              Table state such as filter, sort, and pagination is managed on the
              server.
            </Typography>

            <ServerTable
              columns={columns}
              popUpFilterProps={{
                filterOption: filterOption,
                setFilterQuery: setFilterQuery,
                buttonClassname: cn(
                  'rounded-md px-5 text-sm font-semibold',
                  'h-[2.25rem] py-0 md:h-[2.5rem]'
                ),
              }}
              response={data}
              data={data?.data ?? []}
              isLoading={isPending}
              tableState={tableState}
              setTableState={setTableState}
              className='mt-8'
              withFilter
            />

            <Typography
              as='h2'
              variant='h2'
              className='mt-8 dark:text-gray-300'
            >
              Paginated Table
            </Typography>
            <Typography variant='b2' className='dark:text-gray-300'>
              Server returned all the data then paginated on the client.
            </Typography>

            <PaginatedTable
              columns={columns}
              popUpFilterProps={{
                filterOption: filterOptionPaginatedTable,
                setFilterQuery: setFilterQueryPaginatedTable,
                buttonClassname: cn(
                  'rounded-md px-5 text-sm font-semibold',
                  'h-[2.25rem] py-0 md:h-[2.5rem]'
                ),
              }}
              data={
                unpaginatedData?.data ? filterData(unpaginatedData.data) : []
              }
              withFilter
            />

            <Typography
              as='h2'
              variant='h2'
              className='mt-8 dark:text-gray-300'
            >
              Table
            </Typography>
            <Typography variant='b2' className='dark:text-gray-300'>
              Server returned all the data.
            </Typography>

            <Table
              columns={columns}
              data={unpaginatedData?.data.slice(0, 20) ?? []}
              withFilter
            />
          </div>
        </div>
      </section>
    </main>
  );
}
