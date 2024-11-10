'use client';

import { useEffect, useState } from 'react';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatMessages } from '@/components/ChatMessages';
import { ChatInput } from '@/components/ChatInput';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string }>>([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar onSelectUser={handleSelectUser} />
      <div className="flex flex-1 flex-col">
        <ChatMessages messages={messages} selectedUser={selectedUser} />
        <ChatInput onSendMessage={(text) => {
          setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'me' }]);
        }} />
      </div>
    </div>
  );
}
