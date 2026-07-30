'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatDrawer: React.FC = () => {
  const { isBn } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isBn
        ? 'আসসালামু আলাইকুম! হোটেল ভ্যালেন্টিনো রিসেপশনে আপনাকে স্বাগতম। রুম বুকিং, রুট নির্দেশিকা বা রেস্টুরেন্ট সুবিধা সম্পর্কে আমি কীভাবে আপনাকে সাহায্য করতে পারি?'
        : 'Welcome to Hotel Valentino Reception! How can I assist you today with room reservations, directions, or restaurant facilities?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'For immediate assistance, please call reception at +880 1795 855555.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 90,
          background: 'var(--lacquer)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '30px',
          boxShadow: '0 10px 30px rgba(168,30,45,.4)',
          fontWeight: 700,
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>💬</span>
        <span data-en="1">AI Reception</span>
        <span data-bn="1">AI রিসেপশন</span>
      </button>

      {/* Slide-over Chat Box */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            zIndex: 100,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '500px',
            background: 'var(--limestone)',
            border: 'var(--bl)',
            borderRadius: '12px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: 'var(--night)', color: '#fff', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px' }}>AI Reception Assistant</p>
              <p style={{ fontSize: '11px', color: 'var(--brass)', fontFamily: 'var(--fu)' }}>Hotel Valentino · 24/7</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} style={{ color: '#fff', fontSize: '16px' }}>✕</button>
          </div>

          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'var(--lacquer)' : '#fff',
                  color: m.role === 'user' ? '#fff' : 'var(--ink)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  maxWidth: '85%',
                  border: m.role === 'assistant' ? 'var(--bl)' : 'none',
                }}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: 'var(--slate)' }}>
                Typing response...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} style={{ borderTop: 'var(--bl)', padding: '10px', display: 'flex', gap: '8px', background: '#fff' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isBn ? 'আপনার প্রশ্ন লিখুন...' : 'Type your question...'}
              style={{ flex: 1, padding: '10px', fontSize: '13.5px', border: 'var(--bl)', borderRadius: '4px' }}
            />
            <button type="submit" style={{ background: 'var(--ink)', color: '#fff', padding: '10px 16px', borderRadius: '4px', fontWeight: 600, fontSize: '13px' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};
