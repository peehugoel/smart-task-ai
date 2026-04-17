import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="glass-panel flex justify-between items-center" style={{ margin: '1rem 2rem', padding: '1rem 2rem', borderRadius: 'var(--border-radius-lg)', position:'sticky', top: '1rem', zIndex: 100 }}>
      <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        <span className="text-gradient">SmartTask</span> AI
      </div>
      <div className="nav-links flex gap-4">
        <NavLink to="/" className={({isActive}) => isActive ? "text-gradient" : ""} style={{fontWeight: 500}}>Dashboard</NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? "text-gradient" : ""} style={{fontWeight: 500}}>Tasks</NavLink>
        <NavLink to="/schedule" className={({isActive}) => isActive ? "text-gradient" : ""} style={{fontWeight: 500}}>Schedule</NavLink>
      </div>
      <div className="nav-actions flex gap-4 items-center">
        <NavLink to="/profile" style={{fontWeight: 500}}>Profile</NavLink>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
