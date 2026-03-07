const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FeeManagementService {
  async getAllTransactions() {
    return await prisma.feeTransaction.findMany({
      include: {
        student: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTransactionById(id) {
    return await prisma.feeTransaction.findUnique({
      where: { id },
      include: { student: true }
    });
  }
}

module.exports = new FeeManagementService();
