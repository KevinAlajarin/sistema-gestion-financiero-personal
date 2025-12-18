const express = require('express');
const router = express.Router();
const profileController = require('../controllers/ProfileController');

// Rutas Públicas (relativamente, dentro de la app local)
router.get('/', profileController.getAll);
router.post('/', profileController.create);
router.post('/active', profileController.setActive); // Switch Profile
router.get('/active', profileController.getActive);

module.exports = router;