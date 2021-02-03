import jwt from 'jwt-promisify';
import jwksClient from './jwksClient';

import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

import { isAccessToken } from '../../../utils/authTypes';

export interface RequestWithUser {
  userId?: string;
}

const withUser = (
  handler: NextApiHandler,
  scopes?: string | string[],
  validTokenRequired: boolean = true
) => {
  return async (req: NextApiRequest & RequestWithUser, res: NextApiResponse) => {
    const authValue = req.headers.authorization ?? '';

    // Fail if not a bearer token
    if (authValue.startsWith('Bearer ')) {
      // Strip Bearer from token
      const token = authValue.slice(7);

      // Decode content of token to get kid
      const decoded = await jwt.decode(token, { complete: true });

      if (decoded && isAccessToken(decoded) && decoded.header.alg === 'RS256') {
        // TODO: more checks needed per auth0: https://auth0.com/docs/tokens/access-tokens/validate-access-tokens
        const key = await jwksClient.getSigningKeyAsync(decoded.header.kid);

        const isValid = await jwt
          .verify(token, key.getPublicKey(), { algorithms: ['RS256'] })
          .catch(() => null);

        if (isValid) {
          // Now verify scopes
          if (!Array.isArray(scopes)) scopes = scopes ? [scopes] : []; // Convert scopes argument to string[] if it is a string. If undefined, empty array so that it succeeds regardless

          const isPermitted = scopes.reduce(
            (isAuthed, scope) =>
              isAuthed &&
              (decoded.payload.scope.includes(scope) ||
                decoded.payload.permissions.includes(scope)),
            true
          );

          if (isPermitted) {
            // Token is entirely valid, userId included
            req.userId = decoded.payload.sub;
            return handler(req, res);
          }
        }
      }
    }

    // Getting to hear, the token has failed validation. If this route requires a valid token, fail HTTP401.
    if (validTokenRequired)
      return res.status(401).send({ status: 401, message: 'Authentication Required' });
    else return handler(req, res); // Otherwise run the route but do not provide a userId
  };
};

export default withUser;
