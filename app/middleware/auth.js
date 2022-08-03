const config = require('../../config');
const jwt = require('jsonwebtoken');
const User = require('../user/model');

module.exports = {
  isLoginUser: async (req, res, next) => {
    try {
      const token = req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null;
      const data = jwt.verify(token, config.jwtKey);
      const user = await User.findOne({_id: data.user._id});

      if (!user) {
        throw new Error();f
      }

      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      res.status(401).json({
        Success: false,
        Message: 'Not authorized to access this resources',
      });
    }
  },
};
