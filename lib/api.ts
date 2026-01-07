import axios from "axios";
import { authStorage } from "./auth-storage";

const api = axios.create({
  baseURL: "https://api.globalcontrolsarl.theplug-group.com/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const { token } = await authStorage.getAuthData();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
