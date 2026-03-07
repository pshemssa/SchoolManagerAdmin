const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { hashPassword, comparePassword } = require('../utils/crypto');

class AdminAuthService {
  async login(email, password) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = comparePassword(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { adminId: admin.id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { admin, token };
  }
}

module.exports = new AdminAuthService();
