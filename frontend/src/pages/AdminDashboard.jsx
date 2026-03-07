import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService, userManagementService } from '../services/api';
import { usePendingDevicesCount } from '../hooks/usePendingDevicesCount';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const pendingCount = usePendingDevicesCount();

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );
  }

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
          <NavItem icon="📊" label="Dashboard" active={true} to="/admin/dashboard" />
          <NavItem icon="🎓" label="Students" to="/admin/students" />
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
              <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Overview of school statistics.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard title="Total Students" value={stats.totalStudents || 0} icon="🎓" />
            <StatCard title="Total Teachers" value={stats.totalTeachers || 0} icon="👥" />
            <StatCard title="Fee Collection" value={`$${stats.totalFeeCollection?.toLocaleString() || '0'}`} icon="💰" />
            <StatCard title="Avg Attendance" value={`${stats.averageAttendance || 0}%`} icon="📈" />
          </div>

          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-5">
              Pending Verifications ({pendingUsers.length})
            </h2>

            {pendingUsers.length === 0 ? (
              <p className="text-gray-500">No pending verifications</p>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email} • {user.role}</p>
                      <p className="text-xs text-gray-500 mt-1">Device: {user.deviceId?.slice(0, 12)}...</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleVerify(user.id)} className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm">
                        Verify
                      </button>
                      <button onClick={() => handleReject(user.id)} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
                        Reject
                      </button>
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
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
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
