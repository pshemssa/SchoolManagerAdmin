import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { userManagementService, studentManagementService } from '../services/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', faculty: '', classId: '' });
  const [gradeData, setGradeData] = useState({ subject: '', grade: '', marks: '' });
  const [attendanceData, setAttendanceData] = useState({ date: '', status: 'present' });
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsRes, pendingRes] = await Promise.all([
        studentManagementService.getAllStudents(),
        userManagementService.getPendingVerifications()
      ]);
      setStudents(studentsRes.data.students || []);
      setPendingCount(pendingRes.data.users?.length || 0);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentManagementService.updateStudent(editingStudent.id, formData);
      } else {
        await studentManagementService.createStudent(formData);
      }
      setShowModal(false);
      setFormData({ name: '', faculty: '', classId: '' });
      setEditingStudent(null);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentManagementService.addAttendance(selectedStudent.id, attendanceData);
      setShowAttendanceModal(false);
      setAttendanceData({ date: '', status: 'present' });
      setSelectedStudent(null);
      alert('Attendance recorded successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to record attendance');
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentManagementService.addGrade(selectedStudent.id, gradeData);
      setShowGradeModal(false);
      setGradeData({ subject: '', grade: '', marks: '' });
      setSelectedStudent(null);
      alert('Grade added successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add grade');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({ name: student.name, faculty: student.faculty, classId: student.classId || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    try {
      await studentManagementService.deleteStudent(id);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleAddGrade = (student) => {
    setSelectedStudent(student);
    setShowGradeModal(true);
  };

  const handleAddAttendance = (student) => {
    setSelectedStudent(student);
    setShowAttendanceModal(true);
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={closeSidebar} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative`}>
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold"><Shield/></div>
            <div>
              <h2 className="font-semibold">SchoolSync</h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ADMIN</p>
            </div>
          </div>
          <button onClick={closeSidebar} className={`lg:hidden ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>×</button>
        </div>

        <nav className="p-4 space-y-1">
          <NavItem icon="📊" label="Dashboard" to="/admin/dashboard" />
          <NavItem icon="🎓" label="Students" active={true} to="/admin/students" />
          <NavItem icon="👩🏫" label="Teachers" to="/admin/teachers" />
          <NavItem icon="📚" label="Classes" to="/admin/classes" />
          <NavItem icon="💰" label="Fees" to="/admin/fees" />
          <NavItem icon="🛡️" label="Devices" badge={pendingCount > 0 ? pendingCount : null} to="/admin/devices" />
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin/login'); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
            <span>➜</span> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className={`border-b px-5 py-4 flex items-center justify-between lg:hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <button onClick={toggleSidebar} className={`text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>☰</button>
          <span className="font-semibold">SchoolSync Admin</span>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-5 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Students</h1>
              <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage enrolled students.</p>
            </div>
            <button onClick={() => { setShowModal(true); setEditingStudent(null); setFormData({ name: '', faculty: '', classId: '' }); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Add Student</button>

            <div className="relative w-full md:w-80">
              <input type="text" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full border rounded-lg py-2.5 px-4 pl-10 placeholder-gray-500 focus:outline-none focus:border-blue-500 ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`} />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
          </div>

          <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className={isDark ? 'bg-gray-800' : 'bg-gray-100'}>
                  <tr>
                    <th className="px-6 py-4 font-medium">Student ID</th>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Faculty</th>
                    <th className="px-6 py-4 font-medium">Class</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-200'}`}>
                  {filteredStudents.map(student => (
                    <tr key={student.id} className={isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}>
                      <td className="px-6 py-4"><span className="font-mono text-blue-400">{student.id}</span></td>
                      <td className="px-6 py-4"><div className="font-medium">{student.name}</div></td>
                      <td className="px-6 py-4"><div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{student.faculty}</div></td>
                      <td className="px-6 py-4">{student.classId || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleEdit(student)} className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                        <button onClick={() => handleAddGrade(student)} className="text-green-400 hover:text-green-300 mr-3">Add Grade</button>
                        <button onClick={() => handleAddAttendance(student)} className="text-purple-400 hover:text-purple-300 mr-3">Attendance</button>
                        <button onClick={() => handleDelete(student.id)} className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className={`py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No students found matching your search.</div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-8 rounded-lg w-96 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full px-4 py-2 rounded mb-3 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`} required />
              <input type="text" placeholder="Faculty" value={formData.faculty} onChange={(e) => setFormData({...formData, faculty: e.target.value})} className={`w-full px-4 py-2 rounded mb-3 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`} required />
              <input type="text" placeholder="Class ID" value={formData.classId} onChange={(e) => setFormData({...formData, classId: e.target.value})} className={`w-full px-4 py-2 rounded mb-4 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`} />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Save</button>
                <button type="button" onClick={() => { setShowModal(false); setEditingStudent(null); }} className={`flex-1 py-2 rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-8 rounded-lg w-96 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Add Grade for {selectedStudent?.name}</h2>
            <form onSubmit={handleGradeSubmit}>
              <input type="text" placeholder="Subject" value={gradeData.subject} onChange={(e) => setGradeData({...gradeData, subject: e.target.value})} className={`w-full px-4 py-2 rounded mb-3 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`} required />
              <input type="text" placeholder="Grade (A, B, C, etc.)" value={gradeData.grade} onChange={(e) => setGradeData({...gradeData, grade: e.target.value})} className={`w-full px-4 py-2 rounded mb-3 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`} required />
              <input type="number" placeholder="Marks" value={gradeData.marks} onChange={(e) => setGradeData({...gradeData, marks: e.target.value})} className={`w-full px-4 py-2 rounded mb-4 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`} required />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded">Add Grade</button>
                <button type="button" onClick={() => { setShowGradeModal(false); setSelectedStudent(null); }} className={`flex-1 py-2 rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-8 rounded-lg w-96 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Record Attendance for {selectedStudent?.name}</h2>
            <form onSubmit={handleAttendanceSubmit}>
              <input type="date" value={attendanceData.date} onChange={(e) => setAttendanceData({...attendanceData, date: e.target.value})} className={`w-full px-4 py-2 rounded mb-3 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`} required />
              <select value={attendanceData.status} onChange={(e) => setAttendanceData({...attendanceData, status: e.target.value})} className={`w-full px-4 py-2 rounded mb-4 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded">Record</button>
                <button type="button" onClick={() => { setShowAttendanceModal(false); setSelectedStudent(null); }} className={`flex-1 py-2 rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active = false, badge, to }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  return (
    <button onClick={() => to && navigate(to)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${active ? 'bg-blue-600/20 text-blue-400 font-medium' : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
      <span className="w-6 text-center">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
    </button>
  );
}
