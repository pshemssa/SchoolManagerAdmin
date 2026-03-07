import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/students', label: 'Students', icon: '🎓' },
    { path: '/admin/teachers', label: 'Teachers', icon: '👩🏫' },
    { path: '/admin/classes', label: 'Classes', icon: '📚' },
    { path: '/admin/fees', label: 'Fees', icon: '💰' },
    { path: '/admin/devices', label: 'Devices', icon: '🛡️' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-blue-400">Admin Portal</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
