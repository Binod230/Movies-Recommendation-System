/* SUBEDI RABIN M25W0465 */
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";
import ConfirmModal from "./ConfirmModal";

// --- Interfaces ---
interface User {
  id: number;
  userName?: string;
  username?: string;
  email: string;
  role: string;
}

interface UserListProps {
  users: User[];
  onRefresh: () => void;
}

interface DecodedToken {
  sub: string; // Typically the email in your JWT
  role: string;
}

// Interface for API Errors to avoid 'any'
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

const UserList: React.FC<UserListProps> = ({ users, onRefresh }) => {
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const closeModal = () => setModal((prev) => ({ ...prev, show: false }));

  // --- LOGOUT HELPER ---
  const handleForcedLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    // Use assign instead of direct property mutation to satisfy strict linting
    window.location.assign("/login");
  };

  // --- TOKEN HELPER ---
  const getActiveEmail = (): string => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return (decoded.sub || "").toLowerCase().trim();
    } catch {
      return "";
    }
  };

  // --- ROLE CHANGE LOGIC ---
  const requestRoleChange = (user: User) => {
    const currentRole = user.role.toUpperCase();
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    
    const activeEmail = getActiveEmail();
    const isSelf = activeEmail === user.email.toLowerCase().trim();

    setModal({
      show: true,
      title: isSelf ? "⚠️ Security Warning" : "Confirm Role Change",
      message: isSelf 
        ? "Warning: You are demoting YOURSELF. You will be logged out automatically. Proceed?" 
        : `Change ${user.role || user.username} to ${newRole}?`,
      onConfirm: async () => {
        try {
          await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
          
          if (isSelf) {
            handleForcedLogout();
          } else {
            onRefresh();
            closeModal();
          }
        } catch (err) {
          const error = err as ApiError;
          const msg = error.response?.data?.message || "Role update failed.";
          alert(`Error: ${msg}`);
        }
      },
    });
  };

  // --- DELETE LOGIC ---
const requestDelete = (user: User) => {
    const activeEmail = getActiveEmail();
    const isSelf = activeEmail === user.email.toLowerCase().trim();

    // DEBUG LOGS - Check your F12 console when you click delete
    console.log("DEBUG: Active User Email from Token:", activeEmail);
    console.log("DEBUG: Target User Email from Table:", user.email);
    console.log("DEBUG: Is this a self-delete?", isSelf);

    setModal({
      show: true,
      title: "Delete User",
      message: `Are you sure you want to remove?`,
onConfirm: async () => {
  try {
    // Explicitly check the URL - it matches your console log
    await api.delete(`/admin/users/${user.id}`);
    
    // If we reach here, the server returned 200 OK
    if (isSelf) {
      handleForcedLogout();
    } else {
      onRefresh();
      closeModal();
    }
  } catch (err) {
    const error = err as ApiError;
    // This will help you see the EXACT message from the server
    const serverMessage = error.response?.data?.message || "Forbidden: You don't have permission to delete this user.";
    alert(`Error ${error.response?.status}: ${serverMessage}`);
    closeModal();
  }
},
    });
  };

  return (
    <>
      <ConfirmModal
        isOpen={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />

      <div className="mb-10">
        <h3 className="text-2xl font-black  uppercase tracking-tighter text-white">
          User <span className="text-red-600">Accounts</span>
        </h3>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">
          Manage system access and roles
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black">
              <th className="pb-4 pl-6">Profile</th>
              <th className="pb-4">Email Address</th>
              <th className="pb-4">Role</th>
              <th className="pb-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="group bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <td className="py-6 pl-6 rounded-l-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center font-bold text-sm">
                      {(user.userName || user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="font-black text-sm uppercase tracking-tight text-white">
                      {user.userName || user.username}
                    </span>
                  </div>
                </td>
                <td className="py-6 text-sm text-gray-400 font-medium">
                  {user.email}
                </td>
                <td className="py-6">
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${
                    user.role.toUpperCase() === 'ADMIN' 
                    ? 'border-red-600/30 text-red-500 bg-red-600/5' 
                    : 'border-white/10 text-gray-400 bg-white/5'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-6 pr-6 text-right rounded-r-3xl">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => requestRoleChange(user)}
                      className="px-4 py-2 text-[10px] font-black uppercase bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all"
                    >
                      Change Role
                    </button>
                    <button 
                      onClick={() => requestDelete(user)}
                      className="px-4 py-2 text-[10px] font-black uppercase bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserList;