const jwtService = require('../services/jwt');

const authenticationEnabled = (process.env.AUTHENTICATION_ENABLED || 'true').toLowerCase() === 'true';
const earlyTokenRefreshSeconds = parseInt(process.env.SELF_TOKEN_EARLY_REFRESH_SECONDS || '30', 10);

const selfClientId = process.env.CLIENT_ID;
const selfClientSecret = process.env.CLIENT_SECRET;

let currentSelfToken;
let currentSelfTokenExp = 0;

const generateSelfToken = async () => {
  try {
    const now = Math.floor(new Date().getTime() / 1000);
    if (currentSelfToken == null || currentSelfTokenExp < now) {
      const accessTokenPayload = {
        sub: selfClientId,
        typ: 'client',
      };

      // Generate New Token
      currentSelfToken = await jwtService.encode(accessTokenPayload);
      currentSelfTokenExp = now + jwtService.getExpiry() - earlyTokenRefreshSeconds;
    }

    return Promise.resolve({
      accessToken: currentSelfToken,
      expiresIn: jwtService.getExpiry(),
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const generateUserToken = async (userId) => {
  try {
    const accessTokenPayload = {
      sub: userId,
      typ: 'user',
    };
    const accessToken = await jwtService.encode(accessTokenPayload);
    const expiresIn = jwtService.getExpiry();

    return Promise.resolve({
      accessToken,
      expiresIn,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const generateClientToken = async (clientId) => {
  try {
    const accessTokenPayload = {
      sub: clientId,
      typ: 'client',
    };
    const accessToken = await jwtService.encode(accessTokenPayload);
    const expiresIn = jwtService.getExpiry();

    return Promise.resolve({
      accessToken,
      expiresIn,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const validateToken = async (accessToken) => {
  try {
    // Try verifying
    let payload;
    try {
      payload = await jwtService.decode(accessToken, true);
    } catch (error) {
      // Something wrong with decoding
      L.warn(`Failed to verify token: ${error.message}`);
      return Promise.resolve({ ok: false });
    }

    return Promise.resolve({ ok: true, payload });
  } catch (error) {
    return Promise.reject(error);
  }
}

const authenticate = async (req, res, next) => {
  try {
    let token;

    // Ensure authorization header is present
    if (authenticationEnabled) {
      const authorizationHeader = req.headers['authorization'];
      if (authorizationHeader == null) {
        res.status(401).send('invalid authorization header');
        return;
      }

      const prefix = 'Bearer ';
      if (authorizationHeader.indexOf(prefix) < 0) {
        res.status(401).send('invalid authorization header');
        return;
      }

      token = authorizationHeader.slice(prefix.length);
    }


    // Validate Token
    let hasAccess = !authenticationEnabled;
    if (!hasAccess) {
      const { ok: isValidated, payload } = await validateToken(token);
      if (isValidated && payload) {
        const { sub, typ } = payload;

        hasAccess = true;
        req.accessor = payload;
      }
    }
    


    if (!hasAccess) {
      res.status(401).send('unauthorized');
      return;
    }

    next();
  } catch (error) {
    L.error(error.message); 
    res.status(401).send('unauthorized');
  }
};


module.exports = {
  generateSelfToken,
  generateUserToken,
  generateClientToken,

  authenticate,
  validateToken,
};