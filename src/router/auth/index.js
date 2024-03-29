const express = require('express');
const validate = require('express-validation');
const validator = require('./validation');
const controller = require('./controller');

const router = express.Router({ mergeParams: true });

router.route('/login')
  .post(
    validate(validator.loginUser),
    controller.loginUser,
  );

router.route('/client')
  .post(
    validate(validator.loginClient),
    controller.loginClient,
  );

router.route('/verify')
  .post(
    validate(validator.verifyToken),
    controller.verifyToken,
  );

router.route('/refresh')
  .post(
    validate(validator.refreshToken),
    controller.refreshToken,
  );

module.exports = router;
