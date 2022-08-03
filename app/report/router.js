var express = require('express');
var router = express.Router();
const {spendingReport} = require('./controller');
const {isLoginUser} = require('../middleware/auth');

router.post('/', isLoginUser, spendingReport);

module.exports = router;
