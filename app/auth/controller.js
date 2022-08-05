const User = require('../user/model');
const config = require('../../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  signup: async (req, res) => {
    try {
      const {Email, Password} = req.body;
      const checkEmailFormat = new RegExp(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g,
      ).test(Email);

      if (!checkEmailFormat) {
        res.status(403).json({
          Success: false,
          Message: 'Your email format is wrong',
        });
      } else if (Password.length < 6) {
        res.status(403).json({
          Success: false,
          Message: 'The length of the password at least must be 6 characters',
        });
      } else {
        const Data = new User({
          Email,
          Password,
        });
        await Data.save();
        delete Data._doc.Password;

        res.status(201).json({
          Success: true,
          Message: '',
          Data,
        });
      }
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
  signin: (req, res, next) => {
    const {Email, Password} = req.body;

    User.findOne({Email})
      .then((user) => {
        if (user) {
          const checkPassword = bcrypt.compareSync(Password, user.Password);

          if (checkPassword) {
            const token = jwt.sign(
              {
                user: {
                  _id: user._id,
                  Email: user.Email,
                },
              },
              config.jwtKey,
            );

            res.status(200).json({
              Success: true,
              Message: '',
              Data: token,
            });
          } else {
            res.status(403).json({
              Success: false,
              Message: 'Your password is wrong',
            });
          }
        } else {
          const checkEmailFormat = new RegExp(
            /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g,
          ).test(Email);

          if (!checkEmailFormat) {
            res.status(403).json({
              Success: false,
              Message: 'Your email format is wrong',
            });
          } else {
            res.status(403).json({
              Success: false,
              Message: 'Your email is not registered yet',
            });
          }
        }
      })
      .catch((err) => {
        res.status(500).json({
          Success: false,
          Message: err.message || 'Internal server error',
        });
        next(err);
      });
  },
};
