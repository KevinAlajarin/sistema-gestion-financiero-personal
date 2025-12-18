const express = require('express');
const router = express.Router();
const cardController = require('../controllers/CardController');

router.get('/', cardController.getAll);
router.post('/', cardController.create);
router.put('/:id', cardController.update);
router.delete('/:id', cardController.delete);

router.post('/purchase', cardController.createPurchase); 
router.post('/process-installments', cardController.processInstallments); 

module.exports = router;