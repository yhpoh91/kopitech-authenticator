const { L } = require('../services/logger')('Authenticator');
const jwtService = require('../services/jwt');

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


module.exports = {
  generateSelfToken,
  generateUserToken,
  generateClientToken,
};