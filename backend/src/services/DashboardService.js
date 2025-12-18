const dashboardRepository = require('../repositories/DashboardRepository');

class DashboardService {
    async getDashboardData(profileId) {
        // Calcular rangos de fechas (Mes actual)
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-based

        // Primer día del mes
        const startOfMonth = new Date(year, month, 1);
        // Último día del mes
        const endOfMonth = new Date(year, month + 1, 0);

        const [kpi, expensesByCategory, recentTransactions] = await Promise.all([
            dashboardRepository.getKpiSummary(profileId, startOfMonth, endOfMonth),
            dashboardRepository.getExpensesByCategory(profileId, startOfMonth, endOfMonth),
            dashboardRepository.getLastTransactions(profileId)
        ]);

        return {
            period: {
                month: month + 1,
                year: year
            },
            summary: {
                income: kpi.total_income,
                expense: kpi.total_expenses,
                balance: kpi.global_balance,
                savings: kpi.total_income - kpi.total_expenses // Ahorro neto del mes
            },
            charts: {
                expensesByCategory
            },
            recentTransactions
        };
    }
}

module.exports = new DashboardService();