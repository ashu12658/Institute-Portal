// // src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLogin from './pages/studLoginpage';
import StudentDashboard from './pages/studDashboard';
import { AuthProvider } from './context/studentAuthContext'; 
import AdminTPOLoginPage from './pages/tpoLogin';
import AdminDashboard from './pages/admindashboard';
import TpoDashboard from './pages/tpoDashboard';
import StudentRegister from './pages/registerStud';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/user/login" element={<AdminTPOLoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/tpo-dashboard" element={<TpoDashboard />} />
          <Route path="/" element={<StudentRegister />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
