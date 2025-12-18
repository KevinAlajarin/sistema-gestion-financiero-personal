const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ReportController');

router.get('/export', reportController.downloadTransactions);

module.exports = router;