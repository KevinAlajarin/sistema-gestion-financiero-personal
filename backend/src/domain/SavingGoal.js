class SavingGoal {
    constructor(data) {
        this.id = data.id;
        this.profileId = data.profile_id;
        this.name = data.name;
        this.targetAmount = data.target_amount;
        this.currentAmount = data.current_amount;
        this.targetDate = data.target_date;
        this.monthlyContribution = data.monthly_contribution;
        this.status = data.status;
    }
}
module.exports = SavingGoal;