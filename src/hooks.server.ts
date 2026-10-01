import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.token = event.cookies.get('token');
  return resolve(event);
};