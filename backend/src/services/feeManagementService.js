const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FeeManagementService {
  async getAllTransactions() {
    return await prisma.feeTransaction.findMany({
      include: {
        student: { select: { id: true, name: true, faculty: true } }
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

  async approveRefund(transactionId) {
    const transaction = await prisma.feeTransaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction || transaction.type !== 'withdraw') {
      throw new Error('Invalid refund request');
    }

    return await prisma.feeTransaction.update({
      where: { id: transactionId },
      data: { status: 'completed' }
    });
  }

  async rejectRefund(transactionId) {
    const transaction = await prisma.feeTransaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction || transaction.type !== 'withdraw') {
      throw new Error('Invalid refund request');
    }

    const student = await prisma.student.update({
      where: { id: transaction.studentId },
      data: { feeBalance: { increment: transaction.amount } }
    });

    return await prisma.feeTransaction.update({
      where: { id: transactionId },
      data: { status: 'rejected' }
    });
  }

  async approveDeposit(transactionId) {
    const transaction = await prisma.feeTransaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction || transaction.type !== 'deposit') {
      throw new Error('Invalid deposit request');
    }

    const student = await prisma.student.update({
      where: { id: transaction.studentId },
      data: { feeBalance: { increment: transaction.amount } }
    });

    return await prisma.feeTransaction.update({
      where: { id: transactionId },
      data: { status: 'completed' }
    });
  }

  async rejectDeposit(transactionId) {
    const transaction = await prisma.feeTransaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction || transaction.type !== 'deposit') {
      throw new Error('Invalid deposit request');
    }

    return await prisma.feeTransaction.update({
      where: { id: transactionId },
      data: { status: 'rejected' }
    });
  }
}

module.exports = new FeeManagementService();
