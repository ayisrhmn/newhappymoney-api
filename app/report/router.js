var express = require('express');
var router = express.Router();
const {
  spendingReport,
  topIncomeSpending,
  topExpenseSpending,
  reachedLimit,
  spendingToday,
} = require('./controller');
const {isLoginUser} = require('../middleware/auth');

router.post('/', isLoginUser, spendingReport);
router.post('/top/income', isLoginUser, topIncomeSpending);
router.post('/top/expense', isLoginUser, topExpenseSpending);
router.post('/reachedlimit', isLoginUser, reachedLimit);
router.post('/spend/today', isLoginUser, spendingToday);

module.exports = router;
