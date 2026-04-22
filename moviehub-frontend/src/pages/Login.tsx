// SUBEDI RABIN M25W0465
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom"; 

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // 1. Post to login
      const response = await api.post("/auth/login", { email, password });
      
      // 2. Extract the fresh data returned by your updated Kotlin backend
      const { token, userName, role } = response.data;

      // 3. Clear storage to avoid data ghosting and set fresh items
      localStorage.clear(); 
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("role", role);

      // 4. Trigger AuthContext with the REAL name from the database
      // This ensures "Hari" shows up even if the token says something else
      login(token, role, userName);

      console.log("Login Success. User Name set to:", userName);

      // 5. Navigate based on role
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-[440px] px-6">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            Movie<span className="text-red-600">Hub</span>
          </h1>
          <div className="h-1 w-12 bg-red-600 mx-auto mt-2 rounded-full" />
        </div>

        {/* Main Form Card */}
        <div className="bg-[#141414] border border-white/5 shadow-2xl rounded-3xl p-8 md:p-10">
          <header className="mb-8">
            <h2 className="text-2xl font-bold text-white">Sign In</h2>
            <p className="text-gray-500 text-sm mt-1">Unlimited movies, TV shows, and more.</p>
          </header>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border-l-4 border-red-600 text-red-200 text-xs py-3 px-4 rounded mb-6 animate-pulse">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 transition-colors group-focus-within:text-red-500">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1f1f1f] border border-white/5 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="group">
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider transition-colors group-focus-within:text-red-500">
                  Password
                </label>
                <a href="#" className="text-[10px] text-gray-500 hover:text-white uppercase tracking-tighter">Forgot?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1f1f1f] border border-white/5 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all placeholder:text-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-red-900/20 uppercase tracking-widest text-sm"
            >
              Start Watching
            </button>
          </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-500 text-sm">
                New to MovieHub?{" "}
                <Link 
                  to="/register" 
                  className="text-white hover:text-red-500 font-bold underline-offset-4 transition-all"
                >
                  Create an account
                </Link>
              </p>
            </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
          &copy; 2026 MovieHub Streaming Service
        </p>
      </div>
    </div>
  );
};

export default Login;