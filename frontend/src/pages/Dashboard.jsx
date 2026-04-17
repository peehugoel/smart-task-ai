import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [taskRes, scheduleRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/schedule')
        ]);
        setTasks(taskRes.data);
        setSchedule(scheduleRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center mt-4">Loading dashboard...</div>;

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalHours = pendingTasks.reduce((acc, t) => acc + t.duration, 0);
  const productivityScore = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6">Dashboard</h1>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Pending Tasks</h3>
          <p className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{pendingTasks.length}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Required Focus Time</h3>
          <p className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totalHours}h</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Productivity Score</h3>
          <p className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{productivityScore}%</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        {/* Upcoming Tasks */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex justify-between items-center mb-4">
            <h2>Priority Tasks</h2>
            <Link to="/tasks" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Manage All</Link>
          </div>
          <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
            {pendingTasks.slice(0, 5).map(task => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--border-radius)', border: 'var(--glass-border)' }}>
                <div>
                  <h4 className="mb-1">{task.title}</h4>
                  <div className="flex gap-2 items-center">
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.duration}h</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No pending tasks! Good job!</p>}
          </div>
        </div>

        {/* Schedule Snapshot */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 className="mb-4">Today's Schedule</h2>
          <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
            {schedule.slice(0,4).map(item => (
              <div key={item._id} style={{ position:'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--accent-primary)' }}>
                <div style={{ position:'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                <h4 style={{ fontSize: '0.9rem' }}>{item.task.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(item.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            ))}
            {schedule.length === 0 && (
              <div className="text-center">
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No schedule generated yet.</p>
                <Link to="/schedule" className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Auto Schedule</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
