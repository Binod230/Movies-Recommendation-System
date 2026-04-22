/* SUBEDI RABIN M25W0465 */
import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  role: "ADMIN" | "USER";
  sub: string;
}

export const getRoleFromToken = (): "ADMIN" | "USER" | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role;
  } catch {
    return null;
  }
};
