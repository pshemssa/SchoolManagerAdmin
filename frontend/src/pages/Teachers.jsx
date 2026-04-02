import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePendingDevicesCount } from '../hooks/usePendingDevicesCount';
import { teacherManagementService } from '../services/api';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', password: '' });
  const navigate = useNavigate();
  const pendingCount = usePendingDevicesCount();

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const response = await teacherManagementService.getAllTeachers();
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  };

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await teacherManagementService.updateTeacher(editingTeacher.id, formData);
      } else {
        await teacherManagementService.createTeacher(formData);
      }
      setShowModal(false);
      setFormData({ name: '', email: '', subject: '', password: '' });
      setEditingTeacher(null);
      loadTeachers();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({ name: teacher.name, email: teacher.email, subject: teacher.subject, password: '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this teacher?')) return;
    try {
      await teacherManagementService.deleteTeacher(id);
      loadTeachers();
    } catch (error) {
      alert(error.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={closeSidebar} />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800
          transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative
        `}
      >
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              <Shield/>
            </div>
            <div>
              <h2 className="font-semibold">SchoolSync</h2>
              <p className="text-xs text-gray-400">ADMIN</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-gray-400 hover:text-white">
            ×
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <NavItem icon="📊" label="Dashboard" to="/admin/dashboard" />
          <NavItem icon="🎓" label="Students" to="/admin/students" />
          <NavItem icon="📚" label="Teachers" active={true} to="/admin/teachers" />
          <NavItem icon="📚" label="Classes" to="/admin/classes" />
          <NavItem icon="💰" label="Fees" to="/admin/fees" />
          <NavItem icon="🛡️" label="Devices" badge={pendingCount > 0 ? pendingCount : null} to="/admin/devices" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
          >
            <span>➜</span> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 border-b border-gray-800 px-5 py-4 flex items-center justify-between lg:hidden">
          <button onClick={toggleSidebar} className="text-2xl">
            ☰
          </button>
          <span className="font-semibold">SchoolSync Admin</span>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-5 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Teachers</h1>
              <p className="text-gray-400 mt-1">Manage teaching staff.</p>
            </div>
            <button onClick={() => { setShowModal(true); setEditingTeacher(null); setFormData({ name: '', email: '', subject: '', password: '' }); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Add Teacher</button>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search teachers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.map(t => (
                    <tr key={t.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{t.name}</div>
                          <div className="text-sm text-gray-500 mt-0.5">{t.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-gray-800 text-gray-300 px-2.5 py-1 rounded text-sm font-medium">
                          {t.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4">{t.email}</td>
                      <td className="px-6 py-4">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                        <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                No teachers found matching your search.
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold text-white mb-4">{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-3" required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-3" required />
              <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-3" required />
              <input type="password" placeholder={editingTeacher ? 'Password (leave blank to keep)' : 'Password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-4" required={!editingTeacher} />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Save</button>
                <button type="button" onClick={() => { setShowModal(false); setEditingTeacher(null); }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active = false, badge, to }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => to && navigate(to)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
        ${active ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-300 hover:bg-gray-800'}
      `}
    >
      <span className="w-6 text-center">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}
