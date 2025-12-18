const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/BudgetController');

router.get('/', budgetController.getStatus);
router.post('/', budgetController.setBudget);
router.delete('/:id', budgetController.delete);

module.exports = router;