module.exports = {
  profile: async (req, res) => {
    try {
      const Data = {
        _id: req.user._id,
        Email: req.user.Email,
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
