/* SUBEDI RABIN M25W0465 */
import React, { useEffect, useState, useRef } from 'react';
import { WebSocketContext } from './useWebSockets';
import type {NotificationItem} from './useWebSockets';
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("movie_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [unreadCount, setUnreadCount] = useState<number>(() => {
    const savedCount = localStorage.getItem("unread_count");
    return savedCount ? parseInt(savedCount) : 0;
  });

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:9292/notifications');
    socketRef.current = socket;

    socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const newNotification: NotificationItem = {
    id: Date.now(),
    message: `New Movie: ${data.title}`,
    timestamp: new Date().toLocaleString() //  This returns a string
  };

      setNotifications(prev => {
        const updated = [newNotification, ...prev].slice(0, 10); // Keep last 10
        localStorage.setItem("movie_notifications", JSON.stringify(updated));
        return updated;
      });

      setUnreadCount(prev => {
        const updated = prev + 1;
        localStorage.setItem("unread_count", updated.toString());
        return updated;
      });
    };

    return () => socket.close();
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem("movie_notifications");
    localStorage.removeItem("unread_count");
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
    localStorage.setItem("unread_count", "0");
  };

  return (
    <WebSocketContext.Provider value={{ 
      notifications, 
      unreadCount, 
      clearNotifications,
      resetUnreadCount 
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};