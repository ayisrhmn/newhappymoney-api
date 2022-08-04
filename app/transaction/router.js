var express = require('express');
var router = express.Router();
const {
  myTransaction,
  myBalance,
  createTransaction,
  detailTransaction,
  editTransaction,
  deleteTransaction,
} = require('./controller');
const {isLoginUser} = require('../middleware/auth');

router.post('/', isLoginUser, myTransaction);
router.post('/balance', isLoginUser, myBalance);
router.post('/create', isLoginUser, createTransaction);
router.post('/detail', isLoginUser, detailTransaction);
router.post('/edit', isLoginUser, editTransaction);
router.post('/delete', isLoginUser, deleteTransaction);

module.exports = router;
