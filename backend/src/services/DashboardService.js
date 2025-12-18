const dashboardRepository = require('../repositories/DashboardRepository');

class DashboardService {
    async getDashboardData(profileId) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth(); 

        const startOfMonth = new Date(year, month, 1);
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
                savings: kpi.total_income - kpi.total_expenses 
            },
            charts: {
                expensesByCategory
            },
            recentTransactions
        };
    }
}

module.exports = new DashboardService();