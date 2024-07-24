import { AuthApi } from '@shared/api';
import { NextRequest, NextResponse } from 'next/server';

const authorizedUserOnlyRoutes = ['/play/online'];
const questOnlyRoutes = ['/login', '/register'];

export const middleware = async (request: NextRequest) => {
  try {
    const verifyResponse = await AuthApi.verify();
    if (questOnlyRoutes.includes(request.nextUrl.pathname)) {
      return await questProtect(verifyResponse.ok, request);
    }

    if (authorizedUserOnlyRoutes.includes(request.nextUrl.pathname)) {
      return await authorizedUserProtected(verifyResponse.ok, request);
    }
  } catch (e) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }
};

const questProtect = async (isVerify: boolean, request: NextRequest) => {
  if (isVerify) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  const refreshResponse = await AuthApi.refresh();

  if (refreshResponse.ok) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  return;
};

const authorizedUserProtected = async (
  isVerify: boolean,
  request: NextRequest,
) => {
  if (isVerify) {
    return;
  }

  const refreshResponse = await AuthApi.refresh();

  if (refreshResponse.ok) {
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
