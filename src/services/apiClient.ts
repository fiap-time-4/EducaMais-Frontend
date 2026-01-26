import axios from "axios";
import { authClient } from "@/services/authClient";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de resposta
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    // Sessão encerrada pelo backend
    if (status === 401 || code === "SESSION_EXPIRED") {
      await authClient.signOut();

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
