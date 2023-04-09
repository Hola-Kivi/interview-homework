import bcrypt from 'bcrypt';
import { jwtVerify, SignJWT } from 'jose';
import { beSerializable } from './beSerializable';
import { db } from './db';
import { env } from 'process';
import { User } from '@prisma/client';

import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/app-render';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePasswords = (
  plainTextPassword: string,
  hashedPassword: string
) => bcrypt.compare(plainTextPassword, hashedPassword);
export const createJWT = (user: User) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7;

  return new SignJWT({
    payload: { id: user.id, email: user.email },
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(env.JWT_SECRET));
};
export const validateJWT = async (jwt: string | undefined) => {
  if (!jwt) return '';

  const { payload } = await jwtVerify(
    jwt,
    new TextEncoder().encode(env.JWT_SECRET)
  );

  return payload.payload as any;
};
export const getUserFromCookie = async (
  cookies: RequestCookies | ReadonlyRequestCookies
) => {
  // console.log(cookies);
  const jwt = cookies.get(env.COOKIE_NAME ?? '');

  const { id } = await validateJWT(jwt?.value);

  const user = await db.user.findUnique({
    where: {
      id,
    },
  });
  return beSerializable(user);
};
