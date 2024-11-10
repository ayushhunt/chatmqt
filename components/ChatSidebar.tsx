'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ChatSidebar({ onSelectUser }) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/users');
        const data = await res.json();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      onSelectUser(user);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <div className="flex w-64 flex-col bg-white border-r">
      <div className="p-4">
        <h2 className="text-xl font-bold">Chats</h2>
      </div>
      
      <div className="p-4">
        <select 
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleUserSelect}
          value={selectedUser?.id || ''}
        >
          <option value="" disabled>
            {loading ? 'Loading users...' : 'Select a user...'}
          </option>
          {!loading && users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <MessageCircle className="mr-2 h-4 w-4" />
            General Chat
          </Button>
        </div>
      </div>

      <div className="border-t p-4">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}