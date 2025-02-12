import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true,
  });
  
  // Automatically attach token to every request
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token.trim() !== "") {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
});

  