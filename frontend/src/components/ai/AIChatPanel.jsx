import React, { useState, useRef, useEffect } from 'react';
import api from '../../api';

const AIChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am Smart Task AI. How can I assist you with your schedule today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMessage.text });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't process that right now. Have you set up your API Key?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          boxShadow: '0 8px 32px rgba(59,130,246,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}
      >
        {isOpen ? '✕' : '✨'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="glass-panel animate-fade-in" style={{
          position: 'fixed',
          bottom: '6rem',
          right: '2rem',
          width: '350px',
          height: '500px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderBottom: 'var(--glass-border)' }}>
            <h3 className="text-gradient mb-0" style={{ margin: 0 }}>Smart Assistant</h3>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{ 
                  background: msg.sender === 'user' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.1)', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '1rem',
                  borderBottomRightRadius: msg.sender === 'user' ? '0' : '1rem',
                  borderBottomLeftRadius: msg.sender === 'ai' ? '0' : '1rem',
                  fontSize: '0.9rem'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '1rem', borderBottomLeftRadius: 0, fontSize: '0.9rem' }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

          {/* Input Area */}
          <form style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderTop: 'var(--glass-border)', display: 'flex', gap: '0.5rem' }} onSubmit={handleSend}>
            <input 
              type="text" 
              className="form-input" 
              style={{ flex: 1, padding: '0.5rem 1rem', marginBottom: 0, background: 'rgba(255,255,255,0.05)' }} 
              placeholder="Ask me something..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} disabled={loading}>
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatPanel;
