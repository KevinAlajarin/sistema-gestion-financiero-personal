class Transaction {
    constructor(data) {
        this.id = data.id;
        this.profileId = data.profile_id;
        this.categoryId = data.category_id;
        this.cardId = data.card_id;
        this.installmentId = data.installment_id;
        this.type = data.type;
        this.amount = data.amount;
        this.date = data.date;
        this.description = data.description;
        this.paymentMethod = data.payment_method;
        this.isFixed = data.is_fixed;
        this.isRecurring = data.is_recurring;
        this.status = data.status;
        
        this.categoryName = data.category_name || null;
        this.categoryColor = data.category_color || null;
    }
}
module.exports = Transaction;