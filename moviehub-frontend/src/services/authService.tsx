import axios from "axios";
import type { LoginRequest, AuthResponse } from "../types/auth";

const API_URL = "http://localhost:9292/api/auth";

export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/login`,
    data
  );

  // ✅ SAVE TOKEN
  localStorage.setItem("token", response.data.token);

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
