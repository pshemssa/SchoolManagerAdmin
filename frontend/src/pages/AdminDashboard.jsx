import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { dashboardService, userManagementService } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        dashboardService.getStatistics(),
        userManagementService.getPendingVerifications()
      ]);

      setStats(statsRes.data.statistics || {});
      setPendingUsers(pendingRes.data.users || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await userManagementService.verifyUser(userId);
      loadData();
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await userManagementService.rejectUser(userId);
      loadData();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
        Loading...
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={closeSidebar} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative`}>
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">S</div>
            <div>
              <h2 className="font-semibold">SchoolSync</h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ADMIN</p>
            </div>
          </div>
          <button onClick={closeSidebar} className={`lg:hidden ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>×</button>
        </div>

        <nav className="p-4 space-y-1">
          <NavItem icon="📊" label="Dashboard" active={true} onClick={() => navigate('/admin/dashboard')} />
          <NavItem icon="🎓" label="Students" onClick={() => navigate('/admin/students')} />
          <NavItem icon="👩🏫" label="Teachers" onClick={() => navigate('/admin/teachers')} />
          <NavItem icon="📚" label="Classes" onClick={() => navigate('/admin/classes')} />
          <NavItem icon="💰" label="Fees" onClick={() => navigate('/admin/fees')} />
          <NavItem icon="🛡️" label="Devices" badge={pendingUsers.length} onClick={() => navigate('/admin/devices')} />
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
            <span>➜</span><span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className={`border-b px-5 py-4 flex items-center justify-between lg:hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <button onClick={toggleSidebar} className={`text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>☰</button>
          <span className="font-semibold">SchoolSync Admin</span>
          <button onClick={handleLogout} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm text-white">Logout</button>
        </header>

        <main className="flex-1 p-5 md:p-6 lg:p-8 overflow-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 lg:mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <StatCard title="Total Students" value={stats.totalStudents || 0} icon="🎓" />
            <StatCard title="Total Teachers" value={stats.totalTeachers || 0} icon="👥" />
            <StatCard title="Fee Collection" value={`$${stats.totalFeeCollection?.toLocaleString() || '0'}`} icon="💰" />
            <StatCard title="Avg Attendance" value={`${stats.averageAttendance || 0}%`} icon="📈" />
          </div>

          <section className={`rounded-xl border p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <span>🛡️</span> Pending Device Verifications ({pendingUsers.length})
            </h2>

            {pendingUsers.length === 0 ? (
              <p className={`py-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No pending verifications at the moment.</p>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div key={user.id} className={`rounded-lg p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div>
                      <p className="font-medium">{user.name || user.username}</p>
                      <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email} • {user.role}</p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Device: {user.deviceId?.slice(0, 12)}...</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleVerify(user.id)} className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm text-white">Verify</button>
                      <button onClick={() => handleReject(user.id)} className={`px-5 py-2 rounded-md text-sm ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  const { isDark } = useTheme();
  return (
    <div className={`rounded-xl border p-5 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function NavItem({ icon, label, active = false, badge, onClick }) {
  const { isDark } = useTheme();
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${active ? 'bg-blue-600/20 text-blue-400 font-medium' : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
      <span className="w-6 text-center">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge > 0 && <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">{badge}</span>}
    </button>
  );
}
