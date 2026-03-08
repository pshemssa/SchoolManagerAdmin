const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const userManagementController = require('../controllers/userManagementController');
const dashboardController = require('../controllers/dashboardController');
const teacherManagementController = require('../controllers/teacherManagementController');
const classManagementController = require('../controllers/classManagementController');
const feeManagementController = require('../controllers/feeManagementController');
const studentManagementController = require('../controllers/studentManagementController');
const adminAuthMiddleware = require('../middlewares/adminAuth');

// Auth routes
router.post('/login', adminAuthController.login);
router.post('/logout', adminAuthController.logout);

// User management routes
router.get('/users', adminAuthMiddleware, userManagementController.getAllUsers);
router.get('/users/pending', adminAuthMiddleware, userManagementController.getPendingVerifications);
router.put('/users/:userId/verify', adminAuthMiddleware, userManagementController.verifyUser);
router.put('/users/:userId/reject', adminAuthMiddleware, userManagementController.rejectUser);

// Dashboard routes
router.get('/dashboard/statistics', adminAuthMiddleware, dashboardController.getStatistics);

// Teacher routes
router.get('/teachers', adminAuthMiddleware, teacherManagementController.getAllTeachers);
router.get('/teachers/:id', adminAuthMiddleware, teacherManagementController.getTeacherById);
router.post('/teachers', adminAuthMiddleware, teacherManagementController.createTeacher);
router.put('/teachers/:id', adminAuthMiddleware, teacherManagementController.updateTeacher);
router.delete('/teachers/:id', adminAuthMiddleware, teacherManagementController.deleteTeacher);

// Class routes
router.get('/classes', adminAuthMiddleware, classManagementController.getAllClasses);
router.get('/classes/:id', adminAuthMiddleware, classManagementController.getClassById);
router.post('/classes', adminAuthMiddleware, classManagementController.createClass);
router.put('/classes/:id', adminAuthMiddleware, classManagementController.updateClass);
router.delete('/classes/:id', adminAuthMiddleware, classManagementController.deleteClass);

// Student routes
router.get('/students', adminAuthMiddleware, studentManagementController.getAllStudents);
router.post('/students', adminAuthMiddleware, studentManagementController.createStudent);
router.put('/students/:id', adminAuthMiddleware, studentManagementController.updateStudent);
router.delete('/students/:id', adminAuthMiddleware, studentManagementController.deleteStudent);
router.post('/students/:studentId/grades', adminAuthMiddleware, studentManagementController.addGrade);
router.post('/students/:studentId/attendance', adminAuthMiddleware, studentManagementController.addAttendance);

// Fee routes
router.get('/fees/transactions', adminAuthMiddleware, feeManagementController.getAllTransactions);
router.get('/fees/transactions/:id', adminAuthMiddleware, feeManagementController.getTransactionById);
router.put('/fees/refunds/:id/approve', adminAuthMiddleware, feeManagementController.approveRefund);
router.put('/fees/refunds/:id/reject', adminAuthMiddleware, feeManagementController.rejectRefund);
router.put('/fees/deposits/:id/approve', adminAuthMiddleware, feeManagementController.approveDeposit);
router.put('/fees/deposits/:id/reject', adminAuthMiddleware, feeManagementController.rejectDeposit);

module.exports = router;
