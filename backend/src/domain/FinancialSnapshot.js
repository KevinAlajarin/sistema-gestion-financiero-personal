class FinancialSnapshot {
    constructor(data) {
        this.id = data.id;
        this.profileId = data.profile_id;
        this.snapshotMonth = data.snapshot_month;
        this.totalIncome = data.total_income;
        this.totalExpenses = data.total_expenses;
        this.savingsRate = data.savings_rate;
        this.netResult = data.net_result;
    }
}
module.exports = FinancialSnapshot;