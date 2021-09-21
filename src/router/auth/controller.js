const { L } = require('../../services/logger')('Auth Router');
const userService = require('../../services/user.js');
const clientService = require('../../services/client');
const jwtService = require('../../services/jwt');
const authenticator = require('../../services/authenticator');

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Get Authenticated User from User Service
    const result = await userService.authenticateUser(username, password);
    const { authenticated, user } = result;
    if (!authenticated || user == null) {
      L.info(`Login failed - ${username} [user]`);
      res.status(401).send('unauthorized');
      return;
    }

    // Create Access Token
    const tokenResult = await authenticator.generateUserToken(user.id);
    const { accessToken, expiresIn }  = tokenResult;

    // TODO: Create Refresh Token


    res.json({
      "access_token": accessToken,
      "token_type": "bearer",
      "expires_in": expiresIn,
      "refresh_token": null,
    });
  } catch (error) {
    next(error);
  }
};

const loginClient = async (req, res, next) => {
  try {
    const { clientId, clientSecret } = req.body;

    // Get Authenticated User from User Service
    const result = await clientService.authenticateClient(clientId, clientSecret);
    const { authenticated, client } = result;
    if (!authenticated || client == null) {
      L.info(`Login failed - ${clientId} [client]`);
      res.status(401).send('unauthorized');
      return;
    }

    // Create Access Token
    const tokenResult = await authenticator.generateClientToken(clientId);
    const { accessToken, expiresIn }  = tokenResult;

    // TODO: Create Refresh Token


    res.json({
      "access_token": accessToken,
      "token_type": "bearer",
      "expires_in": expiresIn,
      "refresh_token": null,
    });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    const result = await authenticator.validateToken(accessToken);
    res.json(result);
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
  loginClient,
  verifyToken,
  refreshToken,
};
