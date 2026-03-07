const adminAuthService = require('../services/adminAuthService');

class AdminAuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { admin, token } = await adminAuthService.login(email, password);
      
      res.json({
        message: 'Login successful',
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req, res) {
    res.json({ message: 'Logout successful' });
  }
}

module.exports = new AdminAuthController();
