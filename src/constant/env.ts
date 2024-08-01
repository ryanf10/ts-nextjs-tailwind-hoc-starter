export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export function getShowLogger() {
  return isLocal || process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true';
}
