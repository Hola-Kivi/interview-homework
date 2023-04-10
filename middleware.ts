import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from '@/i18n/i18n-config';

import { jwtVerify } from 'jose';
import Negotiator from 'negotiator';
import { match as matchLocale } from '@formatjs/intl-localematcher';

const verifyJWT = async (jwt: string) => {
  const { payload } = await jwtVerify(
    jwt,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );
  return payload;
};

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};

  request.headers?.forEach((value, key) => (negotiatorHeaders[key] = value));

  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  return matchLocale(languages, locales, i18n.defaultLocale);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocale(request);

  var variable = 'login|register|api|_next/static|_next/image|favicon.ico/';
  var expression = `.*${variable}.*`;
  var exclude = new RegExp(expression, 'g');

  const PUBLIC_FILE = /\.(.*)$/;

  if (PUBLIC_FILE.test(pathname) || exclude.test(pathname)) {
    return NextResponse.next();
  }

  const jwt = request.cookies.get(process.env.COOKIE_NAME as string);

  if (!jwt) {
    request.nextUrl.pathname = `${locale}/login`;

    return NextResponse.redirect(request.nextUrl);
  }

  try {
    await verifyJWT(jwt.value);

    if (
      pathname.startsWith(`/${i18n.defaultLocale}/`) ||
      pathname === `/${i18n.defaultLocale}`
    ) {
      request.nextUrl.pathname = pathname.replace('/en', '');

      return NextResponse.redirect(request.nextUrl);
    }

    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
      request.nextUrl.pathname = `/${locale}${pathname}`;
      return NextResponse.rewrite(request.nextUrl);
    }

    return NextResponse.next();
  } catch (e) {
    console.error(e);
    request.nextUrl.pathname = `${locale}/login`;

    return NextResponse.redirect(request.nextUrl);
  }
}
