var express = require('express');
var router = express.Router();
const {
  myCategory,
  createCategory,
  detailCategory,
  editCategory,
  deleteCategory,
} = require('./controller');
const {isLoginUser} = require('../middleware/auth');

router.post('/', isLoginUser, myCategory);
router.post('/create', isLoginUser, createCategory);
router.post('/detail', isLoginUser, detailCategory);
router.post('/edit', isLoginUser, editCategory);
router.post('/delete', isLoginUser, deleteCategory);

module.exports = router;
