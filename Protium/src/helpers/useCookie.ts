'use server';
import { cookies } from 'next/headers';

export default async function getCookie(name: string) {
  const cookieStore = cookies();

  cookieStore.has(name);

  const hasCookie = cookieStore.has(name);

  if (!hasCookie) {
    console.log('No cookie found');
    return null;
  } else {
    const cookie = cookieStore.get(name);
    return cookie;
  }
}
