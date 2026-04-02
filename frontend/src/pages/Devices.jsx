import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userManagementService } from '../services/api';
import { usePendingDevicesCount } from '../hooks/usePendingDevicesCount';

export default function DeviceVerificationPage() {
  const [devices, setDevices] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const pendingCount = usePendingDevicesCount();

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const response = await userManagementService.getAllUsers();
      console.log('API Response:', response);
      console.log('Users data:', response.data);
      const usersData = response.data.users || response.data || [];
      setDevices(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Error loading devices:', error);
      console.error('Error response:', error.response);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDevices = devices.filter(device => {
    if (filter === 'pending') return !device.isVerified;
    if (filter === 'approved') return device.isVerified;
    return true;
  });

  const handleApprove = async (id) => {
    try {
      await userManagementService.verifyUser(id);
      loadDevices();
    } catch (error) {
      console.error('Error approving device:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await userManagementService.rejectUser(id);
      loadDevices();
    } catch (error) {
      console.error('Error rejecting device:', error);
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
          <NavItem icon="📊" label="Dashboard" to="/admin/dashboard" />
          <NavItem icon="🎓" label="Students" to="/admin/students" />
          <NavItem icon="👩🏫" label="Teachers" to="/admin/teachers" />
          <NavItem icon="📚" label="Classes" to="/admin/classes" />
          <NavItem icon="💰" label="Fees" to="/admin/fees" />
          <NavItem icon="🛡️" label="Devices" active={true} badge={pendingCount > 0 ? pendingCount : null} to="/admin/devices" />
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
              <h1 className="text-2xl md:text-3xl font-bold">Device Verification</h1>
              <p className="text-gray-400 mt-1">Approve or reject device access requests.</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All ({devices.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Pending ({devices.filter(d => !d.isVerified).length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Approved ({devices.filter(d => d.isVerified).length})
            </button>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-6">Device Requests ({filteredDevices.length})</h2>

            <div className="space-y-4">
              {filteredDevices.map(device => (
                <div
                  key={device.id}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-medium text-lg">{device.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{device.email} • {device.role}</div>
                    {device.student && (
                      <div className="text-sm text-blue-400 mt-1">Student: {device.student.name} (ID: {device.studentId})</div>
                    )}
                    <div className="text-xs text-gray-500 mt-2 font-mono">
                      {device.deviceId}
                    </div>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        device.isVerified ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'
                      }`}>
                        {device.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {!device.isVerified && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(device.id)}
                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition flex items-center gap-2"
                      >
                        <span>✓</span> Approve
                      </button>
                      <button
                        onClick={() => handleReject(device.id)}
                        className="px-6 py-2.5 bg-red-600/80 hover:bg-red-700 rounded-lg font-medium transition flex items-center gap-2"
                      >
                        <span>✗</span> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {filteredDevices.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No pending device verification requests.
                </div>
              )}
            </div>
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
