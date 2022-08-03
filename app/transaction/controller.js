const Transaction = require('./model');

module.exports = {
  myTransaction: async (req, res) => {
    try {
      let User = req.user._id;
      let {TrDateMonth} = req.body;
      const checkDateMonth = TrDateMonth === undefined || TrDateMonth === '';

      const Data = await Transaction.find(
        checkDateMonth ? {User} : {User, TrDateMonth},
      )
        .select('Title Note Category Amount TrDateMonth createdAt updatedAt')
        .populate('Category', 'Name Type Limit')
        .sort({createdAt: -1});

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
  detailTransaction: async (req, res) => {
    try {
      const {_id} = req.body;

      const Data = await Transaction.findOne({_id})
        .select('Title Note Category Amount TrDateMonth createdAt updatedAt')
        .populate('Category', 'Name Type Limit');

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
  editTransaction: async (req, res) => {
    try {
      const {_id, Title, Note, Category, Amount, TrDateMonth} = req.body;
      let payload = {Title, Note, Category, Amount, TrDateMonth};

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
