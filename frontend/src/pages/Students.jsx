import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userManagementService } from '../services/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allUsersRes, pendingRes] = await Promise.all([
        userManagementService.getAllUsers(),
        userManagementService.getPendingVerifications()
      ]);
      setStudents(allUsersRes.data.users || []);
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
          <NavItem icon="🎓" label="Students" active={true} to="/admin/students" />
          <NavItem icon="👩🏫" label="Teachers" to="/admin/teachers" />
          <NavItem icon="📚" label="Classes" to="/admin/classes" />
          <NavItem icon="💰" label="Fees" to="/admin/fees" />
          <NavItem icon="🛡️" label="Devices" badge={pendingCount > 0 ? pendingCount : null} to="/admin/devices" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 space-y-3">
          <NavItem icon="🌞" label="Light Mode" />
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
              <h1 className="text-2xl md:text-3xl font-bold">Students</h1>
              <p className="text-gray-400 mt-1">Manage enrolled students.</p>
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
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
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div className="font-medium">{student.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4">{student.role}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`
                            inline-block px-3 py-1 text-xs font-medium rounded-full
                            ${student.isVerified
                              ? 'bg-green-900/50 text-green-300'
                              : 'bg-red-900/50 text-red-300'}
                          `}
                        >
                          {student.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                No students found matching your search.
              </div>
            )}
          </div>
        </main>
      </div>
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
