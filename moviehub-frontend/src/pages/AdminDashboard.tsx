// SUBEDI RABIN M25W0465
import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import AddMovieModal from "../components/AddMovieModal";
import EditMovieModal from "../components/EditMovieModal";
import UserList from "../components/UserList";
import ReviewManagement from "../components/ReviewManagement"; // Import the new component
import { 
  BarChart3, Users, Database, Search, ChevronLeft, ChevronRight, MessageSquare // Import icon for reviews
} from "lucide-react";

/* Interfaces */
interface DashboardStats { totalMovies: number; totalUsers: number; totalReviews: number; }
interface Movie { id: number; title: string; description: string; 
  genre: string; releaseYear: number; posterUrl: string; trailerUrl: 
  string; videoUrl: string; averageRating: number; }
interface PaginatedResponse { content: Movie[]; totalPages: number;
   totalElements: number; number: number; size: number; first: boolean; last: boolean; }
interface User { id: number; userName: string; email: string; role: string; }

const AdminDashboard = () => {
  // 1. Updated view state to include "reviews"
  const [view, setView] = useState<"movies" | "users" | "reviews">("movies");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre] = useState("");

  const [soapCount, setSoapCount] = useState<number>(0);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState<boolean>(true);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalMovies: 0,
    totalUsers: 0,
    totalReviews: 0,
  });
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchDashboardData = useCallback(async (alertMsg?: { type: string, text: string }) => {
    try {
      setLoading(true);
      let movieEndpoint = "/movies";
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("size", pageSize.toString());

      if (searchTerm.trim() !== "") {
        movieEndpoint = "/movies/search";
        params.append("keyword", searchTerm);
      } else if (selectedGenre !== "") {
        movieEndpoint = "/movies/filter";
        params.append("genre", selectedGenre);
      } else {
        params.append("sort", "id,desc");
      }

      const finalUrl = `${movieEndpoint}?${params.toString()}`;
      const [statsRes, moviesRes, soapRes] = await Promise.all([
        api.get<DashboardStats>("/admin/dashboard/stats"),
        api.get<PaginatedResponse>(finalUrl),
        api.get("/movies/stats/soap-count").catch(() => ({ data: 0 }))
      ]);

      setStats(statsRes.data);
      const movieData = moviesRes.data;
      if (movieData && "content" in movieData) {
        setRecentMovies(movieData.content || []);
        setTotalPages(movieData.totalPages || 0);
      } else if (Array.isArray(movieData)) {
        setRecentMovies(movieData);
        setTotalPages(1);
      }

      const finalSoapCount = typeof soapRes.data === 'number' ? soapRes.data : soapRes.data?.data || 0;
      setSoapCount(finalSoapCount);
      if (alertMsg) setMessage(alertMsg);
      
      if (view === "users") {
        const usersRes = await api.get<User[]>("/admin/users");
        setUsers(usersRes.data);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      setRecentMovies([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedGenre, currentPage, view, pageSize]);

  useEffect(() => { setCurrentPage(0); }, [searchTerm, selectedGenre]);
  useEffect(() => {
    const timer = setTimeout(() => { fetchDashboardData(); }, 400);
    return () => clearTimeout(timer);
  }, [fetchDashboardData]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    try {
      await api.delete(`/movies/${movieToDelete.id}`);
      fetchDashboardData({ type: "error", text: `"${movieToDelete.title}" removed.` });
    } catch {
      setMessage({ type: "error", text: "Delete failed." });
    } finally {
      setIsDeleteConfirmOpen(false);
      setMovieToDelete(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white selection:bg-red-600 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 hidden md:flex flex-col flex-shrink-0">
        <div className="p-8">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">MOVIE<span className="text-red-600">HUB</span></h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Admin Console</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setView("movies")} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === "movies" ? "bg-red-600 shadow-lg shadow-red-900/20" : "text-gray-400 hover:bg-white/5"}`}
          >
            <BarChart3 size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setView("users")} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === "users" ? "bg-red-600 shadow-lg shadow-red-900/20" : "text-gray-400 hover:bg-white/5"}`}
          >
            <Users size={18} /> Users
          </button>
          {/* 2. Added Review Management Menu Item */}
          <button 
            onClick={() => setView("reviews")} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === "reviews" ? "bg-red-600 shadow-lg shadow-red-900/20" : "text-gray-400 hover:bg-white/5"}`}
          >
            <MessageSquare size={18} /> Reviews
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-8 md:p-12 scrollbar-thin scrollbar-track-[#050505] scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
        
        <div className="max-w-6xl mx-auto w-full">
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase italic">
                {view === "movies" ? "Admin Dashboard" : view === "users" ? "User Management" : "Review Management"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[11px] text-gray-400 uppercase tracking-[0.15em] font-semibold">
                  System Status: <span className="text-white">Live</span>
                </p>
              </div>
            </div>
          </header>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl group transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500 group-hover:scale-110 transition-transform"><Database size={20} /></div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Movies</p>
              </div>
              <h3 className="text-3xl font-bold tabular-nums">{soapCount.toLocaleString()}</h3>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl group transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-red-600/10 text-red-600 group-hover:scale-110 transition-transform"><Users size={20} /></div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Registered Users</p>
              </div>
              <h3 className="text-3xl font-bold tabular-nums">{stats.totalUsers.toLocaleString()}</h3>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl group transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform"><BarChart3 size={20} /></div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Reviews</p>
              </div>
              <h3 className="text-3xl font-bold tabular-nums">{stats.totalReviews.toLocaleString()}</h3>
            </div>
          </div>

          {/* Conditional View Rendering */}
          <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl mb-12">
            {view === "movies" && (
              <>
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-10">
                  <div className="flex flex-1 flex-col md:flex-row gap-4 w-full">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input 
                        type="text" placeholder="Search by title..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-red-600 outline-none transition-all font-bold"
                      />
                    </div>
                  </div>
                  <button onClick={() => setIsAddModalOpen(true)} className="bg-white text-black px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl">
                    + Upload Movie
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-4">
                    <tbody>
                      {recentMovies.length > 0 ? recentMovies.map((movie) => (
                        <tr key={movie.id} className="group bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                          <td className="py-6 pl-6 rounded-l-[1.5rem]">
                            <div className="flex items-center gap-6">
                              <img src={movie.posterUrl} alt="" className="w-12 h-16 object-cover rounded-xl bg-white/5 border border-white/5" />
                              <div>
                                <span className="block font-black text-sm uppercase tracking-tight">{movie.title}</span>
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{movie.genre}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 text-xs text-gray-500 font-mono tracking-tighter">{movie.releaseYear}</td>
                          <td className="py-6 pr-6 text-right rounded-r-[1.5rem]">
                              <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setSelectedMovie(movie); setIsEditModalOpen(true); }} className="text-[10px] font-black uppercase px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">Edit</button>
                                <button onClick={() => { setMovieToDelete(movie); setIsDeleteConfirmOpen(true); }} className="text-[10px] font-black uppercase text-red-500 px-4 py-2 bg-red-500/10 rounded-lg hover:bg-red-600 hover:text-white transition-all">Delete</button>
                              </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={3} className="text-center py-20 text-gray-600 font-black uppercase text-[10px] tracking-widest italic">{loading ? "Synchronizing..." : "No assets found"}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                      Page <span className="text-white">{currentPage + 1}</span> of <span className="text-white">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                      <button disabled={currentPage === 0} onClick={() => setCurrentPage(prev => prev - 1)} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-20 transition-all"><ChevronLeft size={18} /></button>
                      <button disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(prev => prev + 1)} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-20 transition-all"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 3. Render new ReviewManagement component when view is "reviews" */}
            {view === "users" && <UserList users={users} onRefresh={fetchDashboardData} />}
            {view === "reviews" && <ReviewManagement />}
          </div>
        </div>
      </main>

      {/* Notifications and Modals */}
      {message.text && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-top-10">
          <div className={`${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'} px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 border border-white/20`}>
            <p className="text-[14px] font-black text-white uppercase tracking-wider">{message.text}</p>
          </div>
        </div>
      )}

      <AddMovieModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onRefresh={fetchDashboardData} />
      {selectedMovie && <EditMovieModal isOpen={isEditModalOpen} movie={selectedMovie} onClose={() => { setIsEditModalOpen(false); setSelectedMovie(null); }} onRefresh={fetchDashboardData} />}
      
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 text-center">
            <h2 className="text-2xl font-black uppercase text-white mb-2">Delete Asset?</h2>
            <div className="flex gap-4 w-full mt-10">
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 bg-white/5 py-4 rounded-xl text-white font-bold uppercase text-[10px]">Cancel</button>
              <button onClick={handleConfirmDelete} className="flex-1 bg-red-600 py-4 rounded-xl text-white font-black uppercase text-[10px]">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;