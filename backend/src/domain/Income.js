const Transaction = require('./Transaction');

class Income extends Transaction {
    constructor(data) {
        super(data);
        if (this.type !== 'INCOME') {
            this.type = 'INCOME';
        }
    }
}
module.exports = Income;