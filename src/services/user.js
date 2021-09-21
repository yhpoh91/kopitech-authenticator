const axios = require('axios');
const authenticator = require('./authenticator');

const userServiceAuthenticationUrl = process.env.USER_SERVICE_AUTHENTICATION_URL;

const getServiceToken = async () => authenticator.generateSelfToken();

const getConfig = async () => {
  try {
    const tokenResult = await authenticator.generateSelfToken();
    const { accessToken } = tokenResult;
    const config = {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    };

    return Promise.resolve(config);
  } catch (error) {
    return Promise.reject(error);
  }
};

const authenticateUser = async (username, password) => {
  try {
    const url = userServiceAuthenticationUrl;
    const body = { username, password };
    const config = await getConfig();

    const response = await axios.post(url, body, config);
    const { data } = response;
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  authenticateUser,
};