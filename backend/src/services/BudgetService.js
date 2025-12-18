const budgetRepository = require('../repositories/BudgetRepository');

class BudgetService {
    async setBudget(profileId, data) {
        return await budgetRepository.upsert({ ...data, profileId });
    }

    async getMonthlyStatus(profileId, month, year) {
        const budgets = await budgetRepository.getBudgetVsActual(profileId, month, year);
        
        return budgets.map(b => {
            const percentage = b.planned_amount > 0 
                ? (b.spent_amount / b.planned_amount) * 100 
                : 0;
            
            return {
                ...b,
                remaining: b.planned_amount - b.spent_amount,
                percentage: parseFloat(percentage.toFixed(1)),
                is_over_budget: b.spent_amount > b.planned_amount
            };
        });
    }

    async deleteBudget(profileId, budgetId) {
        await budgetRepository.delete(budgetId);
        return { success: true };
    }
}

module.exports = new BudgetService();