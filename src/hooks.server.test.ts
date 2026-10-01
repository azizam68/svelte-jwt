import { describe, it, expect, vi } from 'vitest';
import { handle } from './hooks.server';

describe('hooks handle', () => {
  it('copie le cookie token dans locals', async () => {
    const event = { cookies: { get: vi.fn().mockReturnValue('abc') }, locals: {} } as any;
    const resolve = vi.fn().mockResolvedValue(new Response('ok'));

    await handle({ event, resolve });

    expect(event.cookies.get).toHaveBeenCalledWith('token');
    expect(event.locals.token).toBe('abc');
    expect(resolve).toHaveBeenCalledWith(event);
  });

  it("laisse locals.token vide s'il n'y a pas de cookie", async () => {
    const event = { cookies: { get: vi.fn().mockReturnValue(undefined) }, locals: {} } as any;
    const resolve = vi.fn().mockResolvedValue(new Response('ok'));

    await handle({ event, resolve });

    expect(event.locals.token).toBeUndefined();
  });
});