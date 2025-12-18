const alertRepository = require('../repositories/AlertRepository');
const budgetRepository = require('../repositories/BudgetRepository');

class AlertService {
    async getUnreadAlerts(profileId) {
        return await alertRepository.getUnread(profileId);
    }

    async markAsRead(profileId, alertId) {
        return await alertRepository.markAsRead(alertId, profileId);
    }

    /**
     * Método CORE: Verifica si algún presupuesto se ha excedido y genera alertas.
     * Se puede llamar después de insertar un gasto.
     */
    async checkBudgetHealth(profileId) {
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Obtener presupuestos y gasto real
        const budgets = await budgetRepository.getBudgetVsActual(profileId, month, year);
        
        const alertsGenerated = [];

        for (const b of budgets) {
            // Regla: Si gasto > planeado
            if (b.spent_amount > b.planned_amount) {
                const message = `Has excedido tu presupuesto de ${b.category_name} por $${b.spent_amount - b.planned_amount}.`;
                
                // Verificar si ya existe alerta reciente para no spammear (simplificado aquí)
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