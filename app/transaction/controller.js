const Transaction = require('./model');

module.exports = {
  myTransaction: async (req, res) => {
    try {
      let User = req.user._id;
      let {TrDateMonth, Show, Sort, Type, Category} = req.body;
      const checkCategory = Category === undefined || Category === '';

      const dtTransaction = await Transaction.find(
        checkCategory ? {User, TrDateMonth} : {User, TrDateMonth, Category},
      )
        .select(
          'Title Note Category Amount TrDateMonth TrDate createdAt updatedAt',
        )
        .populate('Category', 'Name Type Limit')
        .sort({
          TrDate: Sort === 'Oldest' ? 1 : -1,
          createdAt: Sort === 'Oldest' ? 1 : -1,
        });

      let showData = () => {
        if (Type === 'Income') {
          return dtTransaction.filter((v) => {
            return v.Category.Type === 'Income';
          });
        } else if (Type === 'Expense') {
          return dtTransaction.filter((v) => {
            return v.Category.Type === 'Expense';
          });
        } else {
          return dtTransaction;
        }
      };

      res.status(200).json({
        Success: true,
        Message: '',
        Data: Show === 'Recent' ? dtTransaction.slice(0, 5) : showData(),
      });
    } catch (err) {
      res.status(500).json({
        Success: false,
        Message: err.message || 'Internal server error!',
      });
    }
  },
  myBalance: async (req, res) => {
    try {
      let User = req.user._id;
      let {TrDateMonth} = req.body;

      // get all transaction
      const getTransactions = await Transaction.find({
        User,
        TrDateMonth,
      }).populate('Category');

      // get transaction by income & calc total amount
      let transactionByIncome = getTransactions.filter((item) => {
        return item.Category.Type === 'Income';
      });
      let totalTrIncome = transactionByIncome.reduce((val, data) => {
        return val + data.Amount;
      }, 0);

      // get transaction by expense & calc total amount
      let transactionByExpense = getTransactions.filter((item) => {
        return item.Category.Type === 'Expense';
      });
      let totalTrExpense = transactionByExpense.reduce((val, data) => {
        return val + data.Amount;
      }, 0);

      let calcBalance = totalTrIncome - totalTrExpense;

      res.status(200).json({
        Success: true,
        Message: '',
        Data: calcBalance,
      });
    } catch (err) {
      res.status(500).json({
        Success: false,
        Message: err.message || 'Internal server error!',
      });
    }
  },
  createTransaction: async (req, res) => {
    try {
      const payload = req.body;

      let Data = new Transaction({
        ...payload,
        User: req.user._id,
      });
      await Data.save();

      res.status(201).json({
        Success: true,
        Message: 'Transaction created!',
        Data,
      });
    } catch (err) {
      if (err && err.name === 'ValidationError') {
        return res.status(422).json({
          Success: false,
          Message: err.message,
          Fields: err.errors,
        });
      }
      next(err);
    }
  },
  editTransaction: async (req, res) => {
    try {
      const {_id, Title, Note, Category, Amount, TrDateMonth, TrDate} =
        req.body;
      let payload = {Title, Note, Category, Amount, TrDateMonth, TrDate};

      await Transaction.findOneAndUpdate({_id}, payload);

      res.status(201).json({
        Success: true,
        Message: 'Transaction updated!',
        Data: payload,
      });
    } catch (err) {
      if (err && err.name === 'ValidationError') {
        return res.status(422).json({
          Success: false,
          Message: err.message,
          Fields: err.errors,
        });
      }
      next(err);
    }
  },
  deleteTransaction: async (req, res) => {
    try {
      const {_id} = req.body;

      const Data = await Transaction.findOneAndRemove({_id});

      res.status(201).json({
        Success: true,
        Message: 'Transaction removed!',
        Data,
      });
    } catch (err) {
      if (err && err.name === 'ValidationError') {
        return res.status(422).json({
          Success: false,
          Message: err.message,
          Fields: err.errors,
        });
      }
      next(err);
    }
  },
};
