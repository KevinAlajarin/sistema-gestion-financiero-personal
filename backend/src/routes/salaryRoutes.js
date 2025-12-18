const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/SalaryController');

router.get('/config', salaryController.getConfig);
router.post('/config', salaryController.saveConfig);
router.post('/process', salaryController.processSalary);
router.post('/process-all', salaryController.processAllSalaries);

module.exports = router;

