/* SUBEDI RABIN M25W0465 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Heart, LayoutDashboard, LogOut, Settings, Bell, Trash2 } from "lucide-react";
import { useWebSockets } from '../context/useWebSockets';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  
  const { isAuthenticated, logout, role, userName } = useAuth();
  const { notifications, unreadCount, clearNotifications, resetUnreadCount } = useWebSockets();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setIsProfileOpen(false);
    setIsBellOpen(false);
  };

  // Toggle bell and reset the unread count/blinking
  const toggleBell = () => {
    if (!isBellOpen) {
      resetUnreadCount(); // Stop the blinking when user clicks
    }
    setIsBellOpen(!isBellOpen);
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black italic text-white uppercase tracking-tighter">
        Movie<span className="text-red-600">Hub</span>
      </Link>

      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            
            {/* --- NOTIFICATION BELL SECTION --- */}
            <div className="relative">
              <button 
                onClick={toggleBell} 
                className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              >
                {/* Bell Icon Blinks (Bounce) if unreadCount > 0 */}
                <Bell size={24} className={unreadCount > 0 ? "animate-bounce text-red-500" : ""} />
                
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#0a0a0a] animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isBellOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsBellOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-72 bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex justify-between items-center">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Notifications</p>
                      {notifications.length > 0 && (
                        <button onClick={clearNotifications} className="text-red-500 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-600 text-sm">No new movies added yet</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                            <p className="text-sm text-gray-200 leading-tight">{n.message}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* --- USER PROFILE SECTION --- */}
            <div className="relative">
              <button 
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsBellOpen(false); }} 
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-white uppercase border-2 border-transparent group-hover:border-red-500 transition-all shadow-lg shadow-red-600/20">
                  {userName?.charAt(0) || "U"}
                </div>
                <span className="text-white hidden md:block capitalize font-medium">{userName}</span>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-[#141414] border border-white/10 rounded-xl py-2 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Logged in as</p>
                      <p className="text-white text-sm font-bold truncate">{userName}</p>
                    </div>

                    <Link to="/favorites" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-red-500 transition-colors">
                      <Heart size={16} /> My Favorites
                    </Link>

                    <Link to="/profile" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                      <Settings size={16} /> Profile Settings
                    </Link>

                    {role === "ADMIN" && (
                      <Link to="/admin" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-bold">
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-white/5 mt-1">
                      <button 
                        onClick={() => { logout(); navigate("/login"); setIsProfileOpen(false); }} 
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-red-600 hover:text-white transition-all"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold uppercase text-xs tracking-widest transition-colors shadow-lg shadow-red-600/20">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;