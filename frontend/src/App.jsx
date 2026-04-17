import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AIChatPanel from './components/ai/AIChatPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskManager from './pages/TaskManager';
import CalendarView from './pages/CalendarView';
import './App.css';

// A simple hook to check auth status (mocked for now, will connect to localStorage token)
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  const isAuth = isAuthenticated();

  return (
    <Router>
      <div className="app-container">
        {isAuth && <Navbar />}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/tasks" element={<PrivateRoute><TaskManager /></PrivateRoute>} />
            <Route path="/schedule" element={<PrivateRoute><CalendarView /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><div className="glass-panel" style={{padding: '2rem'}}><h2>Profile Settings coming soon</h2></div></PrivateRoute>} />
          </Routes>
        </main>
        {isAuth && <AIChatPanel />}
      </div>
    </Router>
  );
}

export default App;
