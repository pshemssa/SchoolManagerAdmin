import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePendingDevicesCount } from '../hooks/usePendingDevicesCount';
import { classManagementService } from '../services/api';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: '', grade: '' });
  const navigate = useNavigate();
  const pendingCount = usePendingDevicesCount();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await classManagementService.getAllClasses();
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const filtered = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await classManagementService.updateClass(editingClass.id, formData);
      } else {
        await classManagementService.createClass(formData);
      }
      setShowModal(false);
      setFormData({ name: '', grade: '' });
      setEditingClass(null);
      loadClasses();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({ name: cls.name, grade: cls.grade });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return;
    try {
      await classManagementService.deleteClass(id);
      loadClasses();
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
          <NavItem icon="👩🏫" label="Teachers" to="/admin/teachers" />
          <NavItem icon="📚" label="Classes" active={true} to="/admin/classes" />
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
              <h1 className="text-2xl md:text-3xl font-bold">Classes</h1>
              <p className="text-gray-400 mt-1">Manage classes and schedules.</p>
            </div>
            <button onClick={() => { setShowModal(true); setEditingClass(null); setFormData({ name: '', grade: '' }); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Add Class</button>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search classes..."
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
                    <th className="px-6 py-4 font-medium">Class</th>
                    <th className="px-6 py-4 font-medium">Grade</th>
                    <th className="px-6 py-4 font-medium">Created</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 font-medium">{c.name}</td>
                      <td className="px-6 py-4">{c.grade}</td>
                      <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleEdit(c)} className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                        <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                No classes found matching your search.
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold text-white mb-4">{editingClass ? 'Edit Class' : 'Add Class'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Class Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-3" required />
              <input type="text" placeholder="Grade" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-4" required />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Save</button>
                <button type="button" onClick={() => { setShowModal(false); setEditingClass(null); }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded">Cancel</button>
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
