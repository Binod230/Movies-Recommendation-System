/* SUBEDI RABIN M25W0465 */
import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  role: "ADMIN" | "USER" | null;
   token: string | null; 
  userName: string | null;
  login: (token: string, role: "ADMIN" | "USER", name: string) => void;
  logout: () => void;
  updateNameLocally: (newName: string) => void; // Added this
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
