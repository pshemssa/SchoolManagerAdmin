const dashboardService = require('../services/dashboardService');

class DashboardController {
  async getStatistics(req, res) {
    try {
      const stats = await dashboardService.getStatistics();
      res.json({ statistics: stats });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new DashboardController();
