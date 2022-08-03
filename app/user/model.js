const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const HASH_ROUND = 10;

let userSchema = mongoose.Schema(
  {
    Email: {
      type: String,
      require: [true, 'Email must be filled!'],
    },
    Password: {
      type: String,
      require: [true, 'Password must be filled!'],
      maxLength: [
        225,
        'The length of the password must be between 6 - 225 characters',
      ],
      minLength: [
        6,
        'The length of the password must be between 6 - 225 characters',
      ],
    },
  },
  {timestamps: true},
);

userSchema.path('Email').validate(
  async function (value) {
    try {
      const count = await this.model('User').countDocuments({Email: value});
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} already registered`,
);

userSchema.pre('save', function (next) {
  this.Password = bcrypt.hashSync(this.Password, HASH_ROUND);
  next();
});

module.exports = mongoose.model('User', userSchema);
