export interface Auth0User {
  email: string;
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  sub: string;
}

export interface SimlabUser {
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
  fullName: string;
  avatar: string;
  userId: string;
}

export function isValidUser(user: any): user is Auth0User {
  return (
    typeof user?.email === 'string' &&
    typeof user?.given_name === 'string' &&
    typeof user?.family_name === 'string' &&
    typeof user?.nickname === 'string' &&
    typeof user?.name === 'string' &&
    typeof user?.picture === 'string' &&
    typeof user?.sub === 'string'
  );
}

export function asSimlabUser(user: any): SimlabUser | null {
  return isValidUser(user)
    ? {
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
        nickname: user.nickname,
        fullName: user.name,
        avatar: user.picture,
        userId: user.sub,
      }
    : null;
}

export interface AccessToken {
  header: {
    alg: string;
    type: string;
    kid: string;
  };
  payload: {
    iss: string;
    sub: string;
    aud: string[];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
    permissions: string[];
  };
  signature: string;
}

export function isAccessToken(token: any): token is AccessToken {
  return (
    token?.header &&
    typeof token?.header?.alg === 'string' &&
    typeof token?.header?.typ === 'string' &&
    typeof token?.header?.kid === 'string' &&
    token?.payload &&
    typeof token?.payload?.iss === 'string' &&
    typeof token?.payload?.sub === 'string' &&
    Array.isArray(token?.payload?.aud) &&
    typeof token?.payload?.iat === 'number' &&
    typeof token?.payload?.exp === 'number' &&
    typeof token?.payload?.azp === 'string' &&
    typeof token?.payload?.scope === 'string' &&
    Array.isArray(token?.payload?.permissions) &&
    typeof token?.signature === 'string'
  );
}
