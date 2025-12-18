const Transaction = require('./Transaction');

class Income extends Transaction {
    constructor(data) {
        super(data);
        if (this.type !== 'INCOME') {
            // Podríamos lanzar error, o simplemente forzarlo
            this.type = 'INCOME';
        }
    }
}
module.exports = Income;