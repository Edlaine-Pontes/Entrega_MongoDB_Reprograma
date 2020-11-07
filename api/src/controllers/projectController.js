const express = require('express');
const authMiddleware = require('../middlewares/auth')
const router = express.Router();

router.use(authMiddleware)

module.exports = app => app.use('/projects', router);
