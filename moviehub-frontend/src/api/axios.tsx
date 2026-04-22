/* SUBEDI RABIN M25W0465 */
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9292/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Verify this key name!
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token attached to request"); // Debug line
  } else {
    console.warn("No token found in localStorage!");
  }
  return config;
});

export default api;


