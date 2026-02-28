import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientProfile from './components/PatientProfile';
import Landing from './pages/Landing';
import Register from './pages/Register';
import PatientDetails from './pages/PatientDetails';

// Protected Route Component: Agar login nahi hai to login page par bhej dega
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
         <Route path="/" element={<Landing />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} /> 
  <Route path="/patient/:id" element={<PatientDetails />} />

          {/* Protected Routes (Sirf login ke baad dikhengi) */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          {/* Default Route: Dashboard par bhej do */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* Patient Details Route */}
          <Route 
            path="/patient/:id" 
            element={
              <PrivateRoute>
                <div className="p-10 bg-gray-50 min-h-screen">
                   {/* Yahan hum specific patient ki history dikhayenge */}
                   <PatientProfile patientId="REPLACE_WITH_DYNAMIC_ID" patientName="Patient Name" />
                </div>
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;