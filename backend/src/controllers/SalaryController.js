const salaryService = require('../services/SalaryService');

const DEFAULT_PROFILE_ID = 1;

class SalaryController {
    // GET /api/salary/config
    async getConfig(req, res, next) {
        try {
            const config = await salaryService.getConfig(DEFAULT_PROFILE_ID);
            if (!config) {
                return res.status(404).json({ message: 'No hay configuración de sueldo' });
            }
            res.json(config);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/salary/config
    async saveConfig(req, res, next) {
        try {
            const { salary_amount, payday_day, category_id, is_active } = req.body;

            if (!salary_amount || !payday_day) {
                return res.status(400).json({ 
                    error: 'MISSING_FIELDS',
                    message: 'salary_amount y payday_day son requeridos' 
                });
            }

            const config = await salaryService.saveConfig(DEFAULT_PROFILE_ID, {
                salary_amount,
                payday_day,
                category_id,
                is_active
            });

            res.json(config);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/salary/process
    async processSalary(req, res, next) {
        try {
            const result = await salaryService.processSalaryIfDue(DEFAULT_PROFILE_ID);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/salary/process-all
    async processAllSalaries(req, res, next) {
        try {
            const results = await salaryService.processAllDueSalaries();
            res.json({ results });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SalaryController();

