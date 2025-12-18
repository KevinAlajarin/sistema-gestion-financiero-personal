const transactionService = require('../services/TransactionService');

const DEFAULT_PROFILE_ID = 1;

class TransactionController {
    // GET /api/transactions
    async getAll(req, res, next) {
        try {
            const filters = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                type: req.query.type,
                categoryId: req.query.categoryId
            };
            
            const transactions = await transactionService.getTransactions(DEFAULT_PROFILE_ID, filters);
            res.json(transactions);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/transactions
    async create(req, res, next) {
        try {
            const transaction = await transactionService.createTransaction(DEFAULT_PROFILE_ID, req.body);
            res.status(201).json(transaction);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TransactionController();