const prisma = require('../config/prisma');

class UserManagementService {
  async getAllUsers() {
    try {
      return await prisma.user.findMany({
        include: {
          student: { select: { id: true, name: true, faculty: true } }
        }
      });
    } catch (error) {
      console.error('Error fetching users with student relation:', error);
      return await prisma.user.findMany();
    }
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
