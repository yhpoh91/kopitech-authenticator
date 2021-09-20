const axios = require('axios');
const authenticator = require('./authenticator');

const clientServiceAuthenticationUrl = process.env.CLIENT_SERVICE_AUTHENTICATION_URL;

const getServiceToken = async () => Promise.resolve("K-AuthN-Service");

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

const authenticateClient = async (clientId, clientSecret) => {
  try {
    const url = clientServiceAuthenticationUrl;
    const body = { clientId, clientSecret };
    const config = await getConfig();

    const response = await axios.post(url, body, config);
    const { data } = response;
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  authenticateClient,
};