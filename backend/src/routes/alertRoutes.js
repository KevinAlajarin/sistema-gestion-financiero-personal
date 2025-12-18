const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');

// Rutas para alertas
router.get('/unread', alertController.getUnread); // Obtener no leídas
router.put('/:id/read', alertController.markRead); // Marcar como leída
router.post('/check', alertController.checkHealth); // Forzar chequeo (opcional/debug)

module.exports = router;