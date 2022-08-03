const Transaction = require('../transaction/model');
const Category = require('../category/model');

module.exports = {
  spendingReport: async (req, res) => {
    try {
      let User = req.user._id;
      let {TrDateMonth} = req.body;
      const checkDateMonth = TrDateMonth === undefined || TrDateMonth === '';

      const getTransactions = await Transaction.find(
        checkDateMonth ? {User} : {User, TrDateMonth},
      )
        .select('Title Note Category Amount TrDateMonth createdAt updatedAt')
        .populate('Category', 'Name Type Limit');

      let transactionByIncome = getTransactions.filter((item) => {
        return item.Category.Type === 'Income';
      });
      let totalTrIncome = transactionByIncome.reduce((val, data) => {
        return val + data.Amount;
      }, 0);

      let transactionByExpense = getTransactions.filter((item) => {
        return item.Category.Type === 'Expense';
      });
      let totalTrExpense = transactionByExpense.reduce((val, data) => {
        return val + data.Amount;
      }, 0);

      const Data = {
        Income: totalTrIncome,
        Expense: totalTrExpense,
      };

      res.status(200).json({
        Success: true,
        Message: '',
        Data,
      });
    } catch (err) {
      res.status(500).json({
        Success: false,
        Message: err.message || 'Internal server error!',
      });
    }
  },
};
