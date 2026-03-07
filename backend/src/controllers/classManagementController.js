const classManagementService = require('../services/classManagementService');

class ClassManagementController {
  async getAllClasses(req, res) {
    try {
      const classes = await classManagementService.getAllClasses();
      res.json({ classes });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getClassById(req, res) {
    try {
      const { id } = req.params;
      const classData = await classManagementService.getClassById(id);
      res.json({ class: classData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ClassManagementController();
