import { useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';
import axios from 'axios';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export default function useTelegramAuth() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get Telegram init data
    const initData = WebApp.initData || '';
    
    // Verify authentication with backend
    const verifyAuth = async () => {
      try {
        const response = await axios.post('/api/auth/telegram', { initData });
        setUser(response.data.user);
      } catch (error) {
        console.error('Authentication failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAuth();
  }, []);
  
  return { user, loading };
}
