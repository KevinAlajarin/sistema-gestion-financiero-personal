const Transaction = require('./Transaction');

class Expense extends Transaction {
    constructor(data) {
        super(data);
        if (this.type !== 'EXPENSE') {
            this.type = 'EXPENSE';
        }
    }
}
module.exports = Expense;