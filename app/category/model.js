const mongoose = require('mongoose');

let categorySchema = mongoose.Schema(
  {
    Name: {
      type: String,
      require: [true, 'Category must be filled!'],
    },
    Type: {
      type: String,
      require: [true, 'Type must be filled!'],
    },
    Limit: {
      type: Number,
      default: 0,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {timestamps: true},
);

module.exports = mongoose.model('Category', categorySchema);
