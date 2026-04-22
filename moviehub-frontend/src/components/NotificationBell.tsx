/* SUBEDI RABIN M25W0465 */
import { useState } from 'react';
import { useWebSockets } from '../context/useWebSockets';

const NotificationBell = () => {
  // Added resetUnreadCount from context
  const { notifications, unreadCount, clearNotifications, resetUnreadCount } = useWebSockets();
  const [isOpen, setIsOpen] = useState(false);

  // Function to handle opening the bell and stopping the blink
  const handleToggle = () => {
    if (!isOpen) {
      resetUnreadCount(); // Stop the blinking/pulse when opened
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button 
        onClick={handleToggle} 
        className="relative p-2 text-gray-300 hover:text-white focus:outline-none"
      >
        {/* If unreadCount > 0, you can add a class like 'animate-bounce' here if you want the icon to move */}
        <span className={`text-2xl inline-block ${unreadCount > 0 ? 'animate-bounce' : ''}`}>
          🔔
        </span>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-pulse border-2 border-[#0a0a0a]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible backdrop to close dropdown when clicking outside */}
          <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-800 text-sm uppercase tracking-tight">Notifications</span>
              {notifications.length > 0 && (
                <button 
                  onClick={clearNotifications} 
                  className="text-[10px] font-bold uppercase text-red-600 hover:text-red-700 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-400 font-medium">No new movies added yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                    <p className="text-sm text-gray-800 font-semibold leading-tight">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      {/* 🔥 FIXED ERROR: Wrap string in new Date() */}
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;