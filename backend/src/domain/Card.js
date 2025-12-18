class Card {
    constructor(data) {
        this.id = data.id;
        this.profileId = data.profile_id;
        this.name = data.name;
        this.type = data.type;
        this.lastFourDigits = data.last_four_digits;
        this.closingDay = data.closing_day;
        this.dueDay = data.due_day;
        this.creditLimit = data.credit_limit;
        this.currentBalance = data.current_balance;
        
        this.availableCredit = this.creditLimit - this.currentBalance;
    }
}
module.exports = Card;