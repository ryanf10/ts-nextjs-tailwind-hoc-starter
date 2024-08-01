import { buildPaginationControl } from '@/lib/pagination';

describe('buildPaginationControl', () => {
  test('generates pagination with default delta', () => {
    expect(buildPaginationControl(1, 10)).toEqual([1, 2, '...', 9, 10]);
  });

  test('generates pagination with delta 2', () => {
    expect(buildPaginationControl(8, 15, 2)).toEqual([
      1,
      2,
      3,
      '...',
      6,
      7,
      8,
      9,
      10,
      '...',
      13,
      14,
      15,
    ]);
  });

  test('generates pagination with edge case delta', () => {
    expect(buildPaginationControl(1, 1)).toEqual([1]);
    expect(buildPaginationControl(1, 2)).toEqual([1, 2]);
  });

  test('generates pagination with delta larger than page count', () => {
    expect(buildPaginationControl(2, 5, 10)).toEqual([1, 2, 3, 4, 5]);
  });
});
