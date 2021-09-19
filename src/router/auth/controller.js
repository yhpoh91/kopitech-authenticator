const { L } = require('../../services/logger')('Auth Router');
const userService = require('../../services/user.js');
const jwtService = require('../../services/jwt');

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Get Authenticated User from User Service
    const result = await userService.authenticateUser(username, password);
    const { authenticated, user } = result;
    if (!authenticated || user == null) {
      L.info(`Login failed - ${username}`);
      res.status(401).send('unauthorized');
      return;
    }

    // Create Access Token
    const accessTokenPayload = {
      sub: user.id,
      typ: 'user',
    };
    const accessToken = await jwtService.encode(accessTokenPayload);

    // TODO: Create Refresh Token


    res.json({
      "access_token": accessToken,
      "token_type": "bearer",
      "expires_in": jwtService.getExpiry(),
      "refresh_token": null,
    });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    // Try verifying
    let payload;
    try {
      payload = await jwtService.decode(accessToken, true);
    } catch (error) {
      // Something wrong with decoding
      L.warn(`Failed to verify token: ${error.message}`);
      res.json({ ok: false });
      return;
    }

    res.json({ ok: true, payload });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // TODO: Validate Refresh Token


    res.status(500).send('Not implemented');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  verifyToken,
  refreshToken,
};
