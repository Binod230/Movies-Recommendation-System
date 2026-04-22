/* SUBEDI RABIN M25W0465 */
import { useState } from "react";
import { AuthContext } from "./AuthContext";
import type { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize states from localStorage
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState<"ADMIN" | "USER" | null>(
    localStorage.getItem("role") as "ADMIN" | "USER" | null
  );
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("userName"));

  const login = (newToken: string, userRole: "ADMIN" | "USER", name: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", userRole);
    localStorage.setItem("userName", name);
    
    setToken(newToken); // Update token state
    setRole(userRole);
    setUserName(name);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null); // Clear token state
    setRole(null);
    setUserName(null);
    setIsAuthenticated(false);
  };

  //  This function syncs the UI with the DB update
  const updateNameLocally = (newName: string) => {
    localStorage.setItem("userName", newName);
    setUserName(newName);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, userName, token, login, logout,updateNameLocally }}>
      {children}
    </AuthContext.Provider>
  );
};