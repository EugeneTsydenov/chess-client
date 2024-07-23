import { http } from '../../lib';

export class AuthApi {
  public static route = '/auth';

  public static async verify(accessToken?: string) {
    return await http.get({
      url: `${this.route}/verify`,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  public static async refresh(refreshToken?: string, accessToken?: string) {
    return await http.post<RefreshData>({
      url: `${this.route}/refresh`,
      headers: {
        Cookie: `refreshToken=${refreshToken}; httpOnly=true;`,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public static async login(credentials: {
    username: string;
    password: string;
    rememberMe: boolean;
  }) {
    return await http.post<RefreshData>({
      url: `${this.route}/login`,
      body: credentials,
    });
  }
}

interface RefreshData {
  message: string;
  cookies: {
    accessToken: {
      value: string;
      httpOnly: boolean;
      name: string;
    };
    refreshToken: {
      value: string;
      httpOnly: boolean;
      name: string;
      maxAge: number;
    };
  };
}
