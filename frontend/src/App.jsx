import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Fees from './pages/Fees';
import Devices from './pages/Devices';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('adminToken') !== null;
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/admin/login" />;
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        } />
        <Route path="/admin/teachers" element={
          <ProtectedRoute>
            <Teachers />
          </ProtectedRoute>
        } />
        <Route path="/admin/classes" element={
          <ProtectedRoute>
            <Classes />
          </ProtectedRoute>
        } />
        <Route path="/admin/fees" element={
          <ProtectedRoute>
            <Fees />
          </ProtectedRoute>
        } />
        <Route path="/admin/devices" element={
          <ProtectedRoute>
            <Devices />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/admin/login" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
