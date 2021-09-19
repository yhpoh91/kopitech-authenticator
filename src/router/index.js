const express = require('express');

const authRouter = require('./auth');

const { L } = require('../services/logger')('Global Router');

const router = express.Router({ mergeParams: true });

router.get('/', (_, res) => res.send('Server is online'));
router.use('/auth', authRouter);


module.exports = router;
