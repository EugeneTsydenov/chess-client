import {
  refresh,
  refreshResponseSchema,
  verify,
  verifyResponseSchema,
} from '@entities/auth';
import { NextRequest, NextResponse } from 'next/server';

const authorizedUserOnlyRoutes = ['/play/online'];
const questOnlyRoutes = ['/login', '/register'];

export const middleware = async (request: NextRequest) => {
  try {
    const verifyResponse = await verify();

    if (verifyResponse.ok) {
      verifyResponseSchema.parse(verifyResponse.data);
    }

    if (questOnlyRoutes.includes(request.nextUrl.pathname)) {
      return await questProtect(verifyResponse.ok, request);
    }

    if (authorizedUserOnlyRoutes.includes(request.nextUrl.pathname)) {
      return await authorizedUserProtect(verifyResponse.ok, request);
    }
  } catch (e) {
    console.log(e);
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }
};

const questProtect = async (isVerify: boolean, request: NextRequest) => {
  if (isVerify) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  const refreshResponse = await refresh();

  if (refreshResponse.ok) {
    refreshResponseSchema.parse(refreshResponse.data);
    const data = refreshResponse.data;
    const nextResponse = NextResponse.redirect(
      new URL('/not-found', request.url),
    );
    nextResponse.cookies.set(data.cookies.refreshToken);
    nextResponse.cookies.set(data.cookies.accessToken);
    return nextResponse;
  }

  return;
};

const authorizedUserProtect = async (
  isVerify: boolean,
  request: NextRequest,
) => {
  if (isVerify) {
    return;
  }

  const refreshResponse = await refresh();

  if (refreshResponse.ok) {
    refreshResponseSchema.parse(refreshResponse.data);
    const data = refreshResponse.data;
    const nextResponse = NextResponse.redirect(request.url);
    nextResponse.cookies.set(data.cookies.refreshToken);
    nextResponse.cookies.set(data.cookies.accessToken);
    return nextResponse;
  }

  return NextResponse.rewrite(new URL('/not-found', request.url));
};

export const config = {
  matcher: ['/login', '/register', '/play/online'],
};
