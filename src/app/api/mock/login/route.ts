import { NextResponse } from 'next/server';
function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function POST(_: Request) {
  await timeout(5000);
  const errorRate = 0.2;
  return Math.random() > +errorRate
    ? NextResponse.json(
        {
          code: 200,
          data: {
            token: 'dummy-token',
          },
        },
        {
          status: 200,
        }
      )
    : NextResponse.json(
        {
          messages: [
            {
              name: `Internal Server Error`,
              errors: [`Simulasi error (${+errorRate * 100}% error rate)`],
            },
          ],
        },
        {
          status: 500,
        }
      );
}
