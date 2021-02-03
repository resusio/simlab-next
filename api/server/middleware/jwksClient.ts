import jwks from 'jwks-rsa';

const JwksClient = jwks({
  strictSsl: true,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  jwksUri: 'https://resusio.us.auth0.com/.well-known/jwks.json',
});

export default JwksClient;
