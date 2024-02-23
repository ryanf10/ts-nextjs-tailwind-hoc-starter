'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { searchUser, userKey } from '@/lib/api/user';
import { buildPaginatedTableURL } from '@/lib/table';
import useQueryToast from '@/hooks/toast/useQueryToast';
import useServerTable from '@/hooks/useServerTable';

import withAuth from '@/components/hoc/withAuth';
import ServerTable from '@/components/table/ServerTable';

import { ApiError, PaginatedApiResponse } from '@/types/api';
import { User } from '@/types/user';

export default withAuth(SocialPage, 'all', ['admin']);
function SocialPage() {
  const { tableState, setTableState } =
    useServerTable<Omit<User, 'email' | 'roles'>>();
  const columns: ColumnDef<Omit<User, 'email' | 'roles'>>[] = [
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined Date',
      cell: (context) => {
        return (
          <>
            Joined{' '}
            <ReactTimeAgo
              date={new Date(context.row.original.createdAt)}
              locale='en-US'
            />
          </>
        );
      },
    },
  ];

  const url = buildPaginatedTableURL({
    baseUrl: '/user/search',
    tableState,
  });

  const { data, isPending } = useQueryToast(
    useQuery<
      PaginatedApiResponse<Array<Omit<User, 'email' | 'roles'>>>,
      AxiosError<ApiError>
    >({
      queryKey: [userKey, url],
      queryFn: searchUser,
      placeholderData: keepPreviousData,
    }),
    {},
    { hideSuccess: true }
  );

  return (
    <>
      <div className='w-full'>
        <ServerTable
          columns={columns}
          response={data}
          data={data?.data ?? []}
          isLoading={isPending}
          tableState={tableState}
          setTableState={setTableState}
          className='mt-8'
          withFilter
        />
      </div>
    </>
  );
}
