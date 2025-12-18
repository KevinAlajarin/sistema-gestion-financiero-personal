const alertRepository = require('../repositories/AlertRepository');
const budgetRepository = require('../repositories/BudgetRepository');

class AlertService {
    async getUnreadAlerts(profileId) {
        return await alertRepository.getUnread(profileId);
    }

    async markAsRead(profileId, alertId) {
        return await alertRepository.markAsRead(alertId, profileId);
    }

    async checkBudgetHealth(profileId) {
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const budgets = await budgetRepository.getBudgetVsActual(profileId, month, year);
        
        const alertsGenerated = [];

        for (const b of budgets) {
            if (b.spent_amount > b.planned_amount) {
                const message = `Has excedido tu presupuesto de ${b.category_name} por $${b.spent_amount - b.planned_amount}.`;
                
                const alert = await alertRepository.create({
                    profileId,
                    type: 'BUDGET_EXCEEDED',
                    message
                });
                alertsGenerated.push(alert);
            }
        }
        return alertsGenerated;
    }
}

module.exports = new AlertService();