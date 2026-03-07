const feeManagementService = require('../services/feeManagementService');

class FeeManagementController {
  async getAllTransactions(req, res) {
    try {
      const transactions = await feeManagementService.getAllTransactions();
      res.json({ transactions });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTransactionById(req, res) {
    try {
      const { id } = req.params;
      const transaction = await feeManagementService.getTransactionById(id);
      res.json({ transaction });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new FeeManagementController();
