const { expressjwt: expressJwt } = require('express-jwt');

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    // isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/doctor(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/admin(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
      { url: /\/api\/v1\/banners(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
      // { url: /\/api\/v1\/notifications(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
      {
        url: /\/api\/v1\/appointments(.*)/,
        methods: ['GET', 'OPTIONS', 'POST'],
      },

      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin || !payload.isDoctor) {
    done(null, true);
  }

  done();
}
// async function isRevoked(req, token) {
//   if (!token.payload.isAdmin) {
//     return true;
//   }
// }

module.exports = authJwt;
