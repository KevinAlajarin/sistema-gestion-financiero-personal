const budgetService = require('../services/BudgetService');

const DEFAULT_PROFILE_ID = 1;

class BudgetController {
    // GET /api/budgets?month=5&year=2024
    async getStatus(req, res, next) {
        try {
            const month = parseInt(req.query.month) || new Date().getMonth() + 1;
            const year = parseInt(req.query.year) || new Date().getFullYear();

            const status = await budgetService.getMonthlyStatus(DEFAULT_PROFILE_ID, month, year);
            res.json(status);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/budgets
    async setBudget(req, res, next) {
        try {
            const result = await budgetService.setBudget(DEFAULT_PROFILE_ID, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/budgets/:id
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await budgetService.deleteBudget(DEFAULT_PROFILE_ID, id);
            res.json({ success: true, message: 'Presupuesto eliminado correctamente' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BudgetController();