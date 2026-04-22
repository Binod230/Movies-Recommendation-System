/* SUBEDI RABIN M25W0465 */
import { createContext, useContext } from 'react';

export interface NotificationItem {
  id: number;
  message: string;
  timestamp: string; 
}

export interface WebSocketContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  clearNotifications: () => void;
  // ADD THIS LINE BELOW
  resetUnreadCount: () => void; 
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSockets = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSockets must be used within a WebSocketProvider");
  }
  return context;
};