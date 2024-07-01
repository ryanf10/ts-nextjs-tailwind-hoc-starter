'use server';
import { cookies } from 'next/headers';

export const getCookie = async (name: string) => {
  return cookies().get(name);
};

export const deleteCookie = async (name: string | string[]) => {
  if (Array.isArray(name)) {
    name.forEach((item) => {
      cookies().delete(item);
    });
  } else {
    cookies().delete(name);
  }
};
