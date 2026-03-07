import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePendingDevicesCount } from '../hooks/usePendingDevicesCount';
import { feeManagementService } from '../services/api';

const ITEMS_PER_PAGE = 12;

export default function FeeManagementPage() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const pendingCount = usePendingDevicesCount();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await feeManagementService.getAllTransactions();
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const filtered = transactions.filter(t =>
    t.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalCollected = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = transactions
    .filter(t => t.type === 'withdraw' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const pendingTransactionsCount = transactions.filter(t => t.status === 'pending').length;

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
          <NavItem icon="🎓" label="Students" to="/admin/students" />
          <NavItem icon="👩🏫" label="Teachers" to="/admin/teachers" />
          <NavItem icon="📚" label="Classes" to="/admin/classes" />
          <NavItem icon="💰" label="Fees" active={true} to="/admin/fees" />
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
              <h1 className="text-2xl md:text-3xl font-bold">Fee Management</h1>
              <p className="text-gray-400 mt-1">Overview of all fee transactions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Collected</p>
                  <p className="text-3xl font-bold mt-1">${totalCollected.toLocaleString()}</p>
                </div>
                <div className="text-green-400 text-4xl">$</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Refunds</p>
                  <p className="text-3xl font-bold mt-1">${totalRefunds.toLocaleString()}</p>
                </div>
                <div className="text-red-400 text-4xl">↑</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Requests</p>
                  <p className="text-3xl font-bold mt-1">{pendingTransactionsCount}</p>
                </div>
                <div className="text-yellow-400 text-4xl">↓</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold">All Transactions</h2>
            </div>

            <div className="p-5">
              <div className="relative mb-5 max-w-md">
                <input
                  type="text"
                  placeholder="Search by student or description..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Student</th>
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {currentItems.map(tx => (
                      <tr key={tx.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{tx.student?.name || 'N/A'}</td>
                        <td className="px-6 py-4">{tx.description || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${tx.type === 'deposit' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${tx.status === 'completed' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50">Previous</button>
                  <span className="px-4 py-2">Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50">Next</button>
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
