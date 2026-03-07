const userManagementService = require('../services/userManagementService');

class UserManagementController {
  async getAllUsers(req, res) {
    try {
      const users = await userManagementService.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async verifyUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await userManagementService.verifyUser(userId);
      res.json({ message: 'User verified successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async rejectUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await userManagementService.rejectUser(userId);
      res.json({ message: 'User verification rejected', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPendingVerifications(req, res) {
    try {
      const users = await userManagementService.getPendingVerifications();
      res.json({ users });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserManagementController();
