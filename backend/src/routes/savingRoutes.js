const express = require('express');
const router = express.Router();
const savingController = require('../controllers/SavingController');

router.get('/', savingController.getAll);
router.post('/', savingController.create);
router.put('/:id', savingController.update);
router.delete('/:id', savingController.delete);
router.post('/:id/contribute', savingController.contribute);
router.post('/:id/withdraw', savingController.withdraw);

module.exports = router;