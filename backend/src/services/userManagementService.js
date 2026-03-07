const prisma = require('../config/prisma');

class UserManagementService {
  async getAllUsers() {
    return await prisma.user.findMany();
  }

  async verifyUser(userId) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }
    });
  }

  async rejectUser(userId) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isVerified: false }
    });
  }

  async getPendingVerifications() {
    return await prisma.user.findMany({ where: { isVerified: false } });
  }
}

module.exports = new UserManagementService();
