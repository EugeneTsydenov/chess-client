import { $http, BASE_API_URL } from '../../lib';

export const $baseApi = $http.create({
  baseUrl: BASE_API_URL,
  timeout: 1500,
  credentials: 'include',
});
