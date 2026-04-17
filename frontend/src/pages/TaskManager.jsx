import React, { useEffect, useState } from 'react';
import api from '../api';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', duration: '', deadline: '', priority: 'medium' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      setFormData({ title: '', duration: '', deadline: '', priority: 'medium' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { status: task.status === 'pending' ? 'completed' : 'pending' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '2rem' }}>
      
      {/* Create Task Form */}
      <div>
        <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
          <h2 className="mb-4">Add New Task</h2>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-group flex gap-2">
              <div style={{ flex: 1 }}>
                <label className="form-label">Duration (hrs)</label>
                <input type="number" step="0.25" min="0.25" className="form-input" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Priority</label>
                <select className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="form-group mb-4">
              <label className="form-label">Deadline</label>
              <input type="datetime-local" className="form-input" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
            </div>
            <button className="btn btn-primary" style={{width: '100%'}}>Add Task</button>
          </form>
        </div>
      </div>

      {/* Task List */}
      <div>
        <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '600px' }}>
          <h2 className="mb-4">All Tasks</h2>
          <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
            {tasks.map(task => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--border-radius)', border: 'var(--glass-border)', opacity: task.status === 'completed' ? 0.6 : 1 }}>
                <div style={{ flex: 1 }}>
                  <h4 className="mb-1" style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>{task.title}</h4>
                  <div className="flex gap-2 items-center">
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.duration}h | Due: {new Date(task.deadline).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleStatus(task)} className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                    {task.status === 'pending' ? 'Complete' : 'Undo'}
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="btn btn-danger" style={{ padding: '0.4rem' }}>Delete</button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-center" style={{ color: 'var(--text-secondary)', marginTop: '2rem' }}>No tasks found. Start adding some!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskManager;
