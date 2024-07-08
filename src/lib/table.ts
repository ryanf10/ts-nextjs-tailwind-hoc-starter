import queryString, { StringifyOptions } from 'query-string';

import { ServerTableState } from '@/components/table/ServerTable';

type BuildPaginationTableParam = {
  /** API Base URL, with / on the front */
  baseUrl: string;
  tableState: ServerTableState;
  /** Parameter addition
   * @example include: ['user', 'officer']
   */
  additionalParam?: Record<string, unknown>;
  options?: StringifyOptions;
};
type BuildPaginationTableURL = (props: BuildPaginationTableParam) => string;

export const buildPaginatedTableURL: BuildPaginationTableURL = ({
  baseUrl,
  tableState,
  additionalParam,
  options,
}) =>
  queryString.stringifyUrl(
    {
      url: baseUrl,
      query: {
        page_size: tableState.pagination.pageSize,
        page: tableState.pagination.pageIndex + 1,
        sort_name:
          tableState.sorting.length > 0 ? tableState.sorting[0].id : '',
        sort_type:
          tableState.sorting.length > 0
            ? tableState.sorting[0].desc
              ? 'desc'
              : 'asc'
            : '',
        keyword: tableState.globalFilter,
        ...additionalParam,
      },
    },
    {
      arrayFormat: 'comma',
      skipEmptyString: true,
      ...options,
    }
  );

type BuildInfiniteTableParam = {
  /** API Base URL, with / on the front */
  baseUrl: string;
  tableState: ServerTableState;
  page: number;
  /** Parameter addition
   * @example include: ['user', 'officer']
   */
  additionalParam?: Record<string, unknown>;
  options?: StringifyOptions;
};
type BuildInfiniteTableURL = (props: BuildInfiniteTableParam) => string;

export const buildInfiniteTableURL: BuildInfiniteTableURL = ({
  baseUrl,
  page,
  tableState,
  additionalParam,
  options,
}) =>
  queryString.stringifyUrl(
    {
      url: baseUrl,
      query: {
        page_size: tableState.pagination.pageSize,
        page: page + 1,
        sort_name:
          tableState.sorting.length > 0 ? tableState.sorting[0].id : '',
        sort_type:
          tableState.sorting.length > 0
            ? tableState.sorting[0].desc
              ? 'desc'
              : 'asc'
            : '',
        keyword: tableState.globalFilter,
        ...additionalParam,
      },
    },
    {
      arrayFormat: 'comma',
      skipEmptyString: true,
      ...options,
    }
  );
