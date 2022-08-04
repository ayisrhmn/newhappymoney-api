var express = require('express');
var router = express.Router();
const {
  spendingReport,
  topIncomeSpending,
  topExpenseSpending,
} = require('./controller');
const {isLoginUser} = require('../middleware/auth');

router.post('/', isLoginUser, spendingReport);
router.post('/top/income', isLoginUser, topIncomeSpending);
router.post('/top/expense', isLoginUser, topExpenseSpending);

module.exports = router;
