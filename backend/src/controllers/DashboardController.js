const dashboardService = require('../services/DashboardService');

const DEFAULT_PROFILE_ID = 1;

class DashboardController {
    async getSummary(req, res, next) {
        try {
            const data = await dashboardService.getDashboardData(DEFAULT_PROFILE_ID);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DashboardController();