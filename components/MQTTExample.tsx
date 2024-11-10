'use client';

import { useState, useCallback } from 'react';
import { useMQTT } from '@/hooks/useMQTT';

export function MQTTExample() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const topic = 'test/topic';

  const handleMessage = useCallback((msg: string) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { publish } = useMQTT(topic, handleMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message) {
      publish(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">MQTT Example</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 mr-2 rounded"
          placeholder="Enter message"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>

      <div className="border rounded p-4">
        <h3 className="font-bold mb-2">Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index} className="mb-1">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}