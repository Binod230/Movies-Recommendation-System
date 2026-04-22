// SUBEDI RABIN M25W0465
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registration successful");
      navigate("/login");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      {/* Cinematic background glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-[480px] px-6 py-12">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            Movie<span className="text-red-600">Hub</span>
          </h1>
          <div className="h-1 w-12 bg-red-600 mx-auto mt-2 rounded-full" />
        </div>

        {/* Register Card */}
        <div className="bg-[#141414] border border-white/5 shadow-2xl rounded-3xl p-8 md:p-10">
          <header className="mb-8">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Join the community and start your journey.</p>
          </header>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border-l-4 border-red-600 text-red-200 text-xs py-3 px-4 rounded mb-6 animate-pulse">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div className="group">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-red-500 transition-colors">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                onChange={handleChange}
                className="w-full bg-[#1f1f1f] border border-white/5 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all placeholder:text-gray-600"
                required
              />
            </div>

            {/* Email Input */}
            <div className="group">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-red-500 transition-colors">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full bg-[#1f1f1f] border border-white/5 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all placeholder:text-gray-600"
                required
              />
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-red-500 transition-colors">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full bg-[#1f1f1f] border border-white/5 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all placeholder:text-gray-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-red-900/20 uppercase tracking-widest text-sm mt-4"
            >
              Get Started
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-white hover:text-red-500 font-bold underline-offset-4 transition-all"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
          &copy; 2025 MovieHub Streaming Service
        </p>
      </div>
    </div>
  );
};

export default Register;