class Installment {
    constructor(data) {
        this.id = data.id;
        this.profileId = data.profile_id;
        this.cardId = data.card_id;
        this.description = data.description;
        this.totalAmount = data.total_amount;
        this.totalInstallments = data.total_installments;
        this.currentInstallment = data.current_installments;
        this.interestRate = data.interest_rate;
        this.startDate = data.start_date;
        this.isActive = data.is_active;
    }
}
module.exports = Installment;