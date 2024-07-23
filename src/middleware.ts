import { AuthApi } from '@shared/api';
import { NextRequest, NextResponse } from 'next/server';

const authorizedUserOnlyRoutes = ['/play/online'];
const questOnlyRoutes = ['/login', '/register'];

export const middleware = async (request: NextRequest) => {
  try {
    const accessToken = request.cookies.get('accessToken');

    const verifyResponse = await AuthApi.verify(accessToken?.value);

    if (questOnlyRoutes.includes(request.nextUrl.pathname)) {
      return await questProtect(verifyResponse.ok, request);
    }

    if (authorizedUserOnlyRoutes.includes(request.nextUrl.pathname)) {
      return await authorizedUserProtected(verifyResponse.ok, request);
    }
  } catch (e) {
    return NextResponse.redirect(new URL('/500', request.url));
  }
};

const questProtect = async (isVerify: boolean, request: NextRequest) => {
  if (isVerify) {
    return NextResponse.redirect(new URL('/404', request.url));
  }

  const refreshToken = request.cookies.get('refreshToken');
  const accessToken = request.cookies.get('accessToken');

  const refreshResponse = await AuthApi.refresh(
    refreshToken?.value,
    accessToken?.value,
  );

  if (refreshResponse.ok) {
    return NextResponse.redirect(new URL('/404', request.url));
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

  const refreshToken = request.cookies.get('refreshToken');
  const accessToken = request.cookies.get('accessToken');

  const refreshResponse = await AuthApi.refresh(
    refreshToken?.value,
    accessToken?.value,
  );

  if (refreshResponse.ok) {
    const data = refreshResponse.data;
    const nextResponse = NextResponse.redirect(request.url);
    nextResponse.cookies.set(data.cookies.refreshToken);
    nextResponse.cookies.set(data.cookies.accessToken);
    return nextResponse;
  }

  return NextResponse.redirect(new URL('/401', request.url));
};

export const config = {
  matcher: ['/login', '/register', '/play/online'],
};
