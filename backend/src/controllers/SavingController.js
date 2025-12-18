const savingService = require('../services/SavingService');

const DEFAULT_PROFILE_ID = 1;

class SavingController {
    async getAll(req, res, next) {
        try {
            const goals = await savingService.getGoals(DEFAULT_PROFILE_ID);
            res.json(goals);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const goal = await savingService.createGoal(DEFAULT_PROFILE_ID, req.body);
            res.status(201).json(goal);
        } catch (error) {
            next(error);
        }
    }

    async contribute(req, res, next) {
        try {
            const { id } = req.params;
            const { amount } = req.body;
            const result = await savingService.contribute(DEFAULT_PROFILE_ID, id, amount);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const result = await savingService.updateGoal(DEFAULT_PROFILE_ID, id, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await savingService.deleteGoal(DEFAULT_PROFILE_ID, id);
            res.json({ success: true, message: 'Meta eliminada correctamente' });
        } catch (error) {
            next(error);
        }
    }

    async withdraw(req, res, next) {
        try {
            const { id } = req.params;
            const { amount } = req.body;
            const result = await savingService.withdraw(DEFAULT_PROFILE_ID, id, amount);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SavingController();