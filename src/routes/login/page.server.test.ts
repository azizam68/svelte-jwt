import { describe, it, expect, vi } from 'vitest';
import { actions } from './+page.server';

vi.mock('$env/dynamic/private', () => ({
  env: { API_URL: 'https://api.exemple.com' }
}));

function makeEvent(fetchMock: typeof fetch) {
  const formData = new FormData();
  formData.set('email', 'a@b.c');
  formData.set('password', 'secret');
  return {
    request: { formData: async () => formData },
    cookies: { set: vi.fn(), delete: vi.fn() },
    fetch: fetchMock
  } as any;
}

describe('login action', () => {
  it('pose le cookie et redirige vers /dashboard si identifiants valides', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ accessToken: 'eyJ.fake.jwt' }), { status: 200 })
    );
    const event = makeEvent(fetchMock);

    await expect(actions.default(event)).rejects.toMatchObject({
      status: 303,
      location: '/dashboard'
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.exemple.com/api/auth/login',
      expect.objectContaining({ method: 'POST' })
    );
    expect(event.cookies.set).toHaveBeenCalledWith(
      'token',
      'eyJ.fake.jwt',
      expect.objectContaining({ httpOnly: true })
    );
  });

  it('renvoie 401 et ne pose pas de cookie si identifiants invalides', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 401 }));
    const event = makeEvent(fetchMock);

    const result = await actions.default(event);

    expect(result).toMatchObject({ status: 401, data: { error: 'Identifiants invalides' } });
    expect(event.cookies.set).not.toHaveBeenCalled();
  });
});