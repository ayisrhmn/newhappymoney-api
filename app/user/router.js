var express = require('express');
var router = express.Router();
const {profile} = require('./controller');
const {isLoginUser} = require('../middleware/auth');

router.post('/profile', isLoginUser, profile);

module.exports = router;
