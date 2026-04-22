// SUBEDI RABIN M25W0465
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import MovieDetails from "./pages/MovieDetails";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import { WebSocketProvider } from "./context/WebSocketProvider";
import { useWebSockets } from "./context/useWebSockets";
const NotificationToast = () => {
  const { notifications, clearNotifications } = useWebSockets();

  // If there are no notifications in the list, show nothing
  if (notifications.length === 0) return null;

  // Get the latest notification added to the array
  const latest = notifications[0];

  return (
    <div className="fixed top-20 right-5 z-[9999] animate-bounce">
      <div className="bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-2 border-indigo-400">
         <div className="relative">
          <span className="text-2xl">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1.5 rounded-full border border-white">
            {notifications.length}
          </span>
        </div>
        <div>
          <p className="font-bold text-sm uppercase tracking-wider">New Content</p>
          <p className="text-white/90">{latest.message}</p>
        </div>
        <button 
          onClick={clearNotifications}
          className="ml-4 bg-white/20 hover:bg-white/40 p-1 rounded-full transition-colors">
          ✕
        </button>
      </div>
    </div>
  );
};
function App() {
  return (
    <WebSocketProvider>
      <BrowserRouter>
        <NotificationToast />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/favorites" element={<MainLayout><FavoritesPage /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="/movies/:id" element={<MainLayout><MovieDetails /></MainLayout>} />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <MainLayout><AdminDashboard /></MainLayout>
              </ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}
export default App;