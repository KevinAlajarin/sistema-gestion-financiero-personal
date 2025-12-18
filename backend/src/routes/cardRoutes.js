const express = require('express');
const router = express.Router();
const cardController = require('../controllers/CardController');

router.get('/', cardController.getAll);
router.post('/', cardController.create);
router.put('/:id', cardController.update);
router.delete('/:id', cardController.delete);

// Rutas especiales para lógica de tarjetas
router.post('/purchase', cardController.createPurchase); // Compra en cuotas
router.post('/process-installments', cardController.processInstallments); // Trigger batch

module.exports = router;