const joi = require('joi');

module.exports = {
  loginUser: {
    query: {},
    params: {},
    body: {
      username: joi.string().required(),
      password: joi.string().required(),
    },
  },
  verifyToken: {
    query: {},
    params: {},
    body: {
      accessToken: joi.string().required(),
    },
  },
  refreshToken: {
    query: {},
    params: {},
    body: {
      refreshToken: joi.string().required(),
    },
  },
};
