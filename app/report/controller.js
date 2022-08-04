const Transaction = require('../transaction/model');
const Category = require('../category/model');

module.exports = {
  spendingReport: async (req, res) => {
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

      // calc percentage income & expense
      let calcPercentageExpense =
        totalTrIncome === 0
          ? (totalTrExpense / totalTrExpense) * 1
          : (totalTrExpense / totalTrIncome) * 1;
      let calcPercentageIncome =
        (totalTrIncome / totalTrIncome) * 1 - calcPercentageExpense;

      const Data = {
        Income: totalTrIncome,
        PercentageIn: isNaN(calcPercentageIncome) ? 0 : calcPercentageIncome,
        Expense: totalTrExpense,
        PercentageEx: isNaN(calcPercentageExpense) ? 0 : calcPercentageExpense,
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
  topIncomeSpending: async (req, res) => {
    try {
      let User = req.user._id;
      let {TrDateMonth, Show} = req.body;

      // get all category
      const getCategory = await Category.find({User, Type: 'Income'});

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

      // get top income spending by category
      let getData = [];
      getCategory.map((ct) => {
        let getIncome = getTransactions
          .filter((v) => {
            return v.Category.Type === 'Income' && v.Category.Name === ct.Name;
          })
          .reduce((i, o) => o.Amount + i, 0);

        let Percentage = (getIncome / totalTrIncome) * 1;

        return (getData = [
          ...getData,
          {
            Category: ct.Name,
            Total: getIncome,
            Percentage: isNaN(Percentage) ? 0 : Percentage,
          },
        ]);
      });

      // sorting data
      const sortData = (data) => {
        return data.sort((a, b) => {
          return a.Total > b.Total ? -1 : 1;
        });
      };

      let Data =
        Show === 'Top3' ? sortData(getData).slice(0, 3) : sortData(getData);

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
  topExpenseSpending: async (req, res) => {
    try {
      let User = req.user._id;
      let {TrDateMonth, Show} = req.body;

      // get all category
      const getCategory = await Category.find({User, Type: 'Expense'});

      // get all transaction
      const getTransactions = await Transaction.find({
        User,
        TrDateMonth,
      }).populate('Category');

      // get transaction by expense & calc total amount
      let transactionByExpense = getTransactions.filter((item) => {
        return item.Category.Type === 'Expense';
      });
      let totalTrExpense = transactionByExpense.reduce((val, data) => {
        return val + data.Amount;
      }, 0);

      // get top expense spending by category
      let getData = [];
      getCategory.map((ct) => {
        let getExpense = getTransactions
          .filter((v) => {
            return v.Category.Type === 'Expense' && v.Category.Name === ct.Name;
          })
          .reduce((i, o) => o.Amount + i, 0);

        let Percentage = (getExpense / totalTrExpense) * 1;

        return (getData = [
          ...getData,
          {
            Category: ct.Name,
            Total: getExpense,
            Percentage: isNaN(Percentage) ? 0 : Percentage,
          },
        ]);
      });

      // sorting data
      const sortData = (data) => {
        return data.sort((a, b) => {
          return a.Total > b.Total ? -1 : 1;
        });
      };

      let Data =
        Show === 'Top3' ? sortData(getData).slice(0, 3) : sortData(getData);

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
  reachedLimit: async (req, res) => {
    try {
      let User = req.user._id;
      let {TrDateMonth} = req.body;

      // get all category
      const getCategory = await Category.find({User, Type: 'Expense'});

      // get all transaction
      const getTransactions = await Transaction.find({
        User,
        TrDateMonth,
      }).populate('Category');

      // get transaction by expense & calc total amount
      let transactionByExpense = getTransactions.filter((item) => {
        return item.Category.Type === 'Expense';
      });
      let totalTrExpense = transactionByExpense.reduce((val, data) => {
        return val + data.Amount;
      }, 0);

      // get top expense spending by category
      let getData = [];
      getCategory.map((ct) => {
        let getExpense = getTransactions
          .filter((v) => {
            return v.Category.Type === 'Expense' && v.Category.Name === ct.Name;
          })
          .reduce((i, o) => o.Amount + i, 0);

        let Percentage = (getExpense / totalTrExpense) * 1;

        return (getData = [
          ...getData,
          {
            Category: ct.Name,
            Total: getExpense,
            Percentage: isNaN(Percentage) ? 0 : Percentage,
          },
        ]);
      });

      let Data = getData.filter((dt) => {
        return (
          dt.Total >=
          getCategory.find((s) => {
            return s.Name === dt.Category;
          }).Limit
        );
      });

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
