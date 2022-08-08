const mongoose = require('mongoose');
const moment = require('moment');

let transactionSchema = mongoose.Schema(
  {
    Title: {
      type: String,
      require: [true, 'Title must be filled!'],
    },
    Note: {
      type: String,
      default: '',
    },
    Category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    Amount: {
      type: Number,
      default: 0,
    },
    TrDateMonth: {
      type: String,
      default: moment().format('YYYY-MM'),
    },
    TrDate: {
      type: String,
      default: moment().format('YYYY-MM-DD'),
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {timestamps: true},
);

module.exports = mongoose.model('Transaction', transactionSchema);
