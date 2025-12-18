const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');

router.get('/unread', alertController.getUnread); 
router.put('/:id/read', alertController.markRead); 
router.post('/check', alertController.checkHealth); 

module.exports = router;