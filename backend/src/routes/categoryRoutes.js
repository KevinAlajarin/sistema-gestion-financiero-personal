const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

router.get('/', categoryController.getAll);
router.post('/', categoryController.create);

module.exports = router;