var express = require('express');
var router = express.Router();
const {
  myTransaction,
  myBalance,
  createTransaction,
  editTransaction,
  deleteTransaction,
} = require('./controller');
const {isLoginUser} = require('../middleware/auth');

router.post('/', isLoginUser, myTransaction);
router.post('/balance', isLoginUser, myBalance);
router.post('/create', isLoginUser, createTransaction);
router.post('/edit', isLoginUser, editTransaction);
router.post('/delete', isLoginUser, deleteTransaction);

module.exports = router;
