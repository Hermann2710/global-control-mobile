import axios from "axios";
import { authStorage } from "./auth-storage";
import { constants } from "./constants";
import { createImageFormData } from "./upload";

const api = axios.create({
  baseURL: constants.api.baseUrl,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const { token } = await authStorage.getAuthData();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const uploadImage = async (uri: string) => {
  const formData = createImageFormData(uri);
  const response = await api.post("/upload", formData);
  return response.data;
};
