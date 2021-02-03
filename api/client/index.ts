import axios from 'axios';
import type { Auth0ContextInterface } from '@auth0/auth0-react';

export interface ApiHookResult {
  error: string | false;
  loading: boolean;
}

export const fetcher = (url: string) => axios.get(url, { timeout: 4000 }).then((res) => res.data);

export const fetcherWithToken = (url: string, token: string) =>
  axios
    .get(url, { timeout: 4000, headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);

export const getAccessToken = async (
  scope: string,
  { getAccessTokenSilently, getAccessTokenWithPopup }: Auth0ContextInterface
) => {
  const params = {
    audience: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
    scope,
  };
  const accessToken = await getAccessTokenSilently(params).catch(async (err) => {
    if (err?.message.toLowerCase() === 'consent required') {
      // show/await popup
      return await getAccessTokenWithPopup(params).catch(
        () => null // return null if failed
      );
    }
    return null;
  }); // return a null token if unable to get access token as user is not logged in.

  return accessToken;
};
