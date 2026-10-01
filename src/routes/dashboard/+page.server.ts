import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch, cookies }) => {
  if (!locals.token) redirect(303, '/login');

  const res = await fetch(`${env.API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${locals.token}` }
  });

  if (res.status === 401) {
    cookies.delete('token', { path: '/' });
    redirect(303, '/login');
  }

  return { user: await res.json() };
};