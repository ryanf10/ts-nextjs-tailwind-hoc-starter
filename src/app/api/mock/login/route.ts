import { NextResponse } from 'next/server';

export async function POST(_: Request) {
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
