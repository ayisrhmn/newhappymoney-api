const Category = require('./model');

module.exports = {
  myCategory: async (req, res) => {
    try {
      let User = req.user._id;

      const Data = await Category.find({User})
        .select('Name Type Limit createdAt updatedAt')
        .sort({Name: 1});

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
  createCategory: async (req, res) => {
    try {
      const payload = req.body;

      let Data = new Category({
        ...payload,
        User: req.user._id,
      });
      await Data.save();

      res.status(201).json({
        Success: true,
        Message: 'Category created!',
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
  editCategory: async (req, res) => {
    try {
      const {_id, Name, Type, Limit} = req.body;
      let payload = {Name, Type, Limit};

      await Category.findOneAndUpdate({_id}, payload);

      res.status(201).json({
        Success: true,
        Message: 'Category updated!',
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
  deleteCategory: async (req, res) => {
    try {
      const {_id} = req.body;

      const Data = await Category.findOneAndRemove({_id});

      res.status(201).json({
        Success: true,
        Message: 'Category removed!',
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
