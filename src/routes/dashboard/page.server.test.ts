import { describe, it, expect, vi } from 'vitest';
import { load, actions } from './+page.server';

vi.mock('$env/dynamic/private', () => ({
  env: { API_URL: 'https://api.exemple.com' }
}));

describe('dashboard load', () => {
  it('redirige vers /login sans token', async () => {
    const event = { locals: {}, fetch: vi.fn(), cookies: { delete: vi.fn() } } as any;

    await expect(load(event)).rejects.toMatchObject({ status: 303, location: '/login' });
    expect(event.fetch).not.toHaveBeenCalled();
  });

  it("renvoie l'utilisateur si le token est valide", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ email: 'a@b.c' }), { status: 200 })
    );
    const event = { locals: { token: 'good' }, fetch: fetchMock, cookies: { delete: vi.fn() } } as any;

    const result = await load(event);

    expect(result).toEqual({ user: { email: 'a@b.c' } });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.exemple.com/api/auth/me',
      { headers: { Authorization: 'Bearer good' } }
    );
  });

  it('supprime le cookie et redirige si le token est expiré', async () => {
    const event = {
      locals: { token: 'expired' },
      fetch: vi.fn().mockResolvedValue(new Response('{}', { status: 401 })),
      cookies: { delete: vi.fn() }
    } as any;

    await expect(load(event)).rejects.toMatchObject({ status: 303, location: '/login' });
    expect(event.cookies.delete).toHaveBeenCalledWith('token', { path: '/' });
  });
});

describe('dashboard logout', () => {
  it('supprime le cookie et redirige vers /login', async () => {
    const event = { cookies: { delete: vi.fn() } } as any;

    await expect(actions.logout(event)).rejects.toMatchObject({
      status: 303,
      location: '/login'
    });
    expect(event.cookies.delete).toHaveBeenCalledWith('token', { path: '/' });
  });
});