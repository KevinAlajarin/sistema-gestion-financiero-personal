class Budget {
    constructor(data) {
        this.id = data.id;
        this.profileId = data.profile_id;
        this.categoryId = data.category_id;
        this.month = data.month;
        this.year = data.year;
        this.plannedAmount = data.planned_amount;
        
        this.spentAmount = data.spent_amount || 0;
        this.remaining = this.plannedAmount - this.spentAmount;
        this.percentage = this.plannedAmount > 0 ? (this.spentAmount / this.plannedAmount) * 100 : 0;
    }
}
module.exports = Budget;