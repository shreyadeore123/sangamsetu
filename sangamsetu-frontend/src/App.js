import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import MissingPersonForm from './components/missing/MissingPersonForm';
import FoundPersonForm from './components/found/FoundPersonForm';
import MatchSuggestions from './components/matches/MatchSuggestions';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Missing Person Registration - Volunteers, Police, Admin */}
            <Route
              path="/missing-person/register"
              element={
                <ProtectedRoute allowedRoles={['VOLUNTEER', 'POLICE', 'ADMIN']}>
                  <MissingPersonForm />
                </ProtectedRoute>
              }
            />
            
            {/* Found Person Registration - Volunteers, Police, Admin */}
            <Route
              path="/found-person/register"
              element={
                <ProtectedRoute allowedRoles={['VOLUNTEER', 'POLICE', 'ADMIN']}>
                  <FoundPersonForm />
                </ProtectedRoute>
              }
            />
            
            {/* Match Suggestions - Police, Admin */}
            <Route
              path="/matches"
              element={
                <ProtectedRoute allowedRoles={['POLICE', 'ADMIN']}>
                  <MatchSuggestions />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 - Redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
