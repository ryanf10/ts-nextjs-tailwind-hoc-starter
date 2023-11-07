import { NextResponse } from 'next/server';

export async function GET(_: Request) {
  return NextResponse.json(
    {
      code: 200,
      data: {
        id: 1,
        name: 'Theodorus Clarence',
        token: 'dummy-token',
      },
    },
    {
      status: 200,
    }
  );
}
