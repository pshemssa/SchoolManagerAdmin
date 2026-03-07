const teacherManagementService = require('../services/teacherManagementService');

class TeacherManagementController {
  async getAllTeachers(req, res) {
    try {
      const teachers = await teacherManagementService.getAllTeachers();
      res.json({ teachers });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTeacherById(req, res) {
    try {
      const { id } = req.params;
      const teacher = await teacherManagementService.getTeacherById(id);
      res.json({ teacher });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TeacherManagementController();
