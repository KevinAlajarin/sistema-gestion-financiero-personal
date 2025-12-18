const reportService = require('../services/ReportService');

const DEFAULT_PROFILE_ID = 1;

class ReportController {
    async downloadTransactions(req, res, next) {
        try {
            const csvData = await reportService.generateTransactionCSV(DEFAULT_PROFILE_ID);

            res.header('Content-Type', 'text/csv');
            res.attachment('transactions.csv');
            return res.send(csvData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportController();