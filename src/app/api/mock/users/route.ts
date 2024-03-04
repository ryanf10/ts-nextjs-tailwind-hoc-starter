import { NextRequest, NextResponse } from 'next/server';

export type MockUser = {
  id: number;
  name: string;
  email: string;
  country: string;
};

const users: MockUser[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@mail.com`,
  country: ['Indonesia', 'Malaysia', 'Singapore'][i < 30 ? 0 : i < 60 ? 1 : 2],
}));

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: NextRequest) {
  const pageSize = +(req.nextUrl.searchParams.get('page_size') as string) || 5;
  const pageNumber = +(req.nextUrl.searchParams.get('page') as string);
  const sort = req.nextUrl.searchParams.get('sort') as keyof MockUser;
  const type = req.nextUrl.searchParams.get('type') as 'asc' | 'desc';
  const keyword = req.nextUrl.searchParams.get('keyword') as string;
  const country = req.nextUrl.searchParams.get(
    'country'
  ) as unknown as string[];

  let data: MockUser[];

  data = keyword
    ? users.filter(
        (user) => user.name.toUpperCase().indexOf(keyword.toUpperCase()) > -1
      )
    : users;

  data =
    country?.length > 0
      ? data.filter((user) => country.includes(user.country))
      : data;

  data = sort
    ? type === 'asc'
      ? data.sort((a, b) => (a[sort] > b[sort] ? 1 : -1))
      : data.sort((a, b) => (a[sort] > b[sort] ? -1 : 1))
    : data;

  const total = data.length;

  data =
    pageSize && pageNumber
      ? data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
      : data;

  await timeout(1000);
  return NextResponse.json({
    code: 200,
    status: 'OK',
    data,
    total: total,
    keyword: keyword,
    page: pageNumber,
    page_size: pageSize,
    sort_name: sort,
    sort_type: type,
  });
}
