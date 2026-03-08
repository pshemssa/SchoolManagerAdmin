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

  async approveRefund(req, res) {
    try {
      const { id } = req.params;
      const transaction = await feeManagementService.approveRefund(id);
      res.json({ message: 'Refund approved', transaction });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async rejectRefund(req, res) {
    try {
      const { id } = req.params;
      const transaction = await feeManagementService.rejectRefund(id);
      res.json({ message: 'Refund rejected', transaction });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async approveDeposit(req, res) {
    try {
      const { id } = req.params;
      const transaction = await feeManagementService.approveDeposit(id);
      res.json({ message: 'Deposit approved', transaction });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async rejectDeposit(req, res) {
    try {
      const { id } = req.params;
      const transaction = await feeManagementService.rejectDeposit(id);
      res.json({ message: 'Deposit rejected', transaction });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new FeeManagementController();
