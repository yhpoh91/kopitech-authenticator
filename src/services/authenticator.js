const jwtService = require('../services/jwt');

const earlyTokenRefreshSeconds = 300;

let currentSelfToken;
let currentSelfTokenExp = 0;

const generateSelfToken = async () => {
  try {
    const now = Math.floor(new Date().getTime() / 1000);
    if (currentSelfToken == null || currentSelfTokenExp < now) {
      const accessTokenPayload = {
        sub: 'kopitech-authenticator',
        typ: 'svc',
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


module.exports = {
  generateSelfToken,
  generateUserToken,
};