module.exports = {
  index: async (_, res) => {
    try {
      res.status(200).json({
        Success: true,
        Message: 'alive',
        Data: 'newhappymoney-api | Success',
      });
    } catch (err) {
      res.status(500).json({
        Success: false,
        Message: err.message || 'Internal server error!',
      });
    }
  },
};
