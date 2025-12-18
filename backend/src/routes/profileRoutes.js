const express = require('express');
const router = express.Router();
const profileController = require('../controllers/ProfileController');

router.get('/', profileController.getAll);
router.post('/', profileController.create);
router.post('/active', profileController.setActive); 
router.get('/active', profileController.getActive);

module.exports = router;