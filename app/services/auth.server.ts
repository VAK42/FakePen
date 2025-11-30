import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from 'react-router';
import { prisma } from '~/db/client.server';
const sessionSecret = '4b031157876d971be71dfb152b8dfd2718bf9475e5ae5a84344c5847f92cd7c1f706c36ee29f44b6bd75a6cd876bb0500dfee2ce183cdedd6bc67faf5c4214ef';
const storage = createCookieSessionStorage({
  cookie: {
    name: 'fakepenSession',
    secure: false,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
});
export async function createUserSession(userId: number, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  });
}
export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}
export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'number') return null;
  return userId;
}
export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== 'number') {
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return user;
  } catch {
    throw logout(request);
  }
}
export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  });
}
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}