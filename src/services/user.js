const axios = require('axios');

const userServiceHost = process.env.USER_SERVICE_HOST;

const getServiceToken = async () => Promise.resolve("K-AuthN-Service");

const getConfig = async () => {
  try {
    const serviceToken = await getServiceToken();
    const config = {
      headers: {
        "Authorization": `Bearer ${serviceToken}`,
      },
    };

    return Promise.resolve(config);
  } catch (error) {
    return Promise.reject(error);
  }
};

const authenticateUser = async (username, password) => {
  try {
    const url = `${userServiceHost}/users/authenticate`;
    const body = { username, password };

    const response = await axios.post(url, body);
    const { data } = response;
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  authenticateUser,
};