import { NextResponse } from 'next/server';
function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function GET(_: Request) {
  await timeout(5000);
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
