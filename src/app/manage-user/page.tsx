'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import ReactTimeAgo from 'react-time-ago';

import { getAllUser, userKey } from '@/lib/api/user';
import { buildPaginatedTableURL } from '@/lib/table';
import { cn } from '@/lib/utils';
import useQueryToast from '@/hooks/toast/useQueryToast';
import useServerTable from '@/hooks/useServerTable';

import withAuth from '@/components/hoc/withAuth';
import PopupFilter, { PopupFilterProps } from '@/components/table/PopupFilter';
import ServerTable from '@/components/table/ServerTable';

import { ApiError, PaginatedApiResponse } from '@/types/api';
import { User } from '@/types/user';

export default withAuth(SocialPage, 'all', ['admin']);
function SocialPage() {
  const { tableState, setTableState } = useServerTable<User>();
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'roles',
      header: 'Role',
      cell: (context) => {
        return (
          <div className='flex gap-1'>
            {context.row.original.roles.map((role) => (
              <div
                key={role.id}
                className='bg-boxdark rounded-md px-3 text-sm text-white'
              >
                {role.name}
              </div>
            ))}
          </div>
        );
      },
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

  const [filterQuery, setFilterQuery] = useState<{ role: string[] }>({
    role: [],
  });
  const filterOption: PopupFilterProps<{ role: string[] }>['filterOption'] =
    React.useMemo(
      () => [
        {
          id: 'role',
          name: 'Role',
          options: [
            { id: 'admin', name: 'Admin' },
            { id: 'user', name: 'User' },
          ],
        },
      ],
      []
    );

  const url = buildPaginatedTableURL({
    baseUrl: '/user/all',
    tableState,
    additionalParam: {
      role: filterQuery.role,
    },
  });

  const { data, isPending } = useQueryToast(
    useQuery<PaginatedApiResponse<Array<User>>, AxiosError<ApiError>>({
      queryKey: [userKey, url],
      queryFn: getAllUser,
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
          header={
            <PopupFilter
              filterOption={filterOption}
              setFilterQuery={setFilterQuery}
              buttonClassname={cn(
                'rounded-md px-5 text-sm font-semibold',
                'h-[2.25rem] py-0 md:h-[2.5rem]'
              )}
            />
          }
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
