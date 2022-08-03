const mongoose = require('mongoose');

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
    TrDate: {
      type: Date,
      default: new Date(),
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {timestamps: true},
);

module.exports = mongoose.model('Transaction', transactionSchema);
