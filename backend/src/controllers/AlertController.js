const alertService = require('../services/AlertService');

const DEFAULT_PROFILE_ID = 1;

class AlertController {
    async getUnread(req, res, next) {
        try {
            const alerts = await alertService.getUnreadAlerts(DEFAULT_PROFILE_ID);
            res.json(alerts);
        } catch (error) {
            next(error);
        }
    }

    async markRead(req, res, next) {
        try {
            const { id } = req.params;
            await alertService.markAsRead(DEFAULT_PROFILE_ID, id);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }
    
    // Endpoint para forzar chequeo manual (útil para testing)
    async checkHealth(req, res, next) {
        try {
            const alerts = await alertService.checkBudgetHealth(DEFAULT_PROFILE_ID);
            res.json({ message: 'Chequeo completado', newAlerts: alerts });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AlertController();