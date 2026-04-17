import React, { useEffect, useState } from 'react';
import api from '../api';

const CalendarView = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await api.get('/schedule');
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoSchedule = async () => {
    setLoading(true);
    setMessage('');
    setConflicts([]);
    try {
      const res = await api.post('/schedule/auto');
      setMessage(res.data.message);
      setConflicts(res.data.conflicts || []);
      fetchSchedules();
    } catch (err) {
      setMessage('Failed to auto-schedule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Smart Schedule</h1>
        <button onClick={handleAutoSchedule} disabled={loading} className="btn btn-primary">
          {loading ? 'Optimizing...' : 'Run Auto Engine'}
        </button>
      </div>

      {message && (
        <div className="badge badge-low mb-4 flex justify-center py-2" style={{ fontSize: '1rem' }}>
          {message}
        </div>
      )}

      {conflicts.length > 0 && (
        <div className="glass-panel badge-high mb-6" style={{ padding: '1rem' }}>
          <h4>Conflicts Detected:</h4>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            {conflicts.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 className="mb-4">Upcoming Timeline</h2>
        {schedules.length === 0 ? (
          <div className="text-center py-8 text-secondary">
            <p>Your calendar is empty!</p>
            <p>Run the Auto Engine to generate an optimized daily plan.</p>
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
            {schedules.sort((a,b)=> new Date(a.startTime) - new Date(b.startTime)).map((item, index) => (
              <div key={item._id} className="mb-6 relative">
                <div style={{ position: 'absolute', left: '-2.4rem', background: 'var(--bg-primary)', padding: '0.2rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}></div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex justify-between">
                    <h4>{item.task.title}</h4>
                    <span className="text-gradient font-bold">
                      {new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(item.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="mt-2 text-secondary" style={{ fontSize: '0.85rem' }}>
                    Scheduled Date: {new Date(item.startTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarView;
