export type ApiResponse<T> = {
  statusCode: number;
  data: T;
};

export type ApiError = {
  messages: Array<{
    name: string;
    errors: Array<string>;
  }>;
};

export type UninterceptedApiError = {
  message: string | Record<string, string[]>;
};

export type BasePaginationResponseField = {
  total: number;
  keyword?: string;
  page: number;
  page_size: number;
  sort_name?: string;
  sort_type?: 'asc' | 'desc';
};
export type PaginatedApiResponse<T> = {
  statusCode: number;
  data: T;
} & BasePaginationResponseField;
