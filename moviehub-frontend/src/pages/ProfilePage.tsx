// SUBEDI RABIN M25W0465
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import { User, Lock, CheckCircle, AlertCircle } from "lucide-react";
const ProfilePage = () => {
  const { userName, token, updateNameLocally } = useAuth();

  // States for Profile Info
  const [newName, setNewName] = useState(userName || "");

  // States for Password Update
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Feedback States
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  //  Auto-hide message after 4 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);

      // Cleanup timer if the user triggers another message before 5s
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.put(
        "http://localhost:9292/api/users/update-name",
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Sync Context and LocalStorage
      updateNameLocally(newName);

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.log("error", err);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        "http://localhost:9292/api/users/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Password changed successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log("error", err);
      setMessage({
        type: "error",
        text: "Incorrect current password or update failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
   
      <header className="mb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black  uppercase tracking-tighter text-white">
          Profile <span className="text-red-600">Settings</span>
        </h1>
        <div className="h-1 w-20 bg-red-600 mt-2"></div>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT COLUMN: Update Name */}
        <section className="bg-[#141414] p-8 rounded-2xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-red-600" size={24} />
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Personal Info
            </h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors text-white"
                placeholder="Enter your name"
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-white text-black font-bold py-3 rounded-lg uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Name"}
            </button>
          </form>
        </section>

        {/* RIGHT COLUMN: Change Password */}
        <section className="bg-[#141414] p-8 rounded-2xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-red-600" size={24} />
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Security
            </h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors text-white"
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>

      {/* Floating Status Message with Progress Bar */}
      {message.text && (
        <div
          className={`fixed bottom-10 right-10 flex flex-col overflow-hidden rounded-xl shadow-2xl transition-all duration-500 transform translate-y-0 opacity-100 ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="flex items-center gap-3 px-6 py-4">
            {message.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-bold text-sm uppercase tracking-wider text-white">
              {message.text}
            </span>
          </div>
          {/* Progress Bar Animation */}
          <div className="h-1 bg-black/20 w-full">
            <div 
              className="h-full bg-white/50" 
              style={{ 
                animation: 'shrink 4s linear forwards' 
              }} 
            />
          </div>
        </div>
      )}

      {/* Inline styles for the progress bar animation */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;