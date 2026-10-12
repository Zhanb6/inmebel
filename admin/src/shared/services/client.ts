import axios from "axios";
import { makeApiWithHandler } from "./api";
import { tokenStore } from "..";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
	withCredentials: true, 
});


let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  async (config) => {
    const tokens = tokenStore.get();
    
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/refresh-token`,
      {}, // тело запроса пустое
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
					Authorization: `Bearer ${tokenStore.get().access}`,
        },
      }
    );

    const newAccessToken = response.data?.access_token?.token;

    if (!newAccessToken) {
      throw new Error("Invalid refresh token response");
    }

    tokenStore.set(newAccessToken);

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", newAccessToken);
    }

    return newAccessToken;

  } catch (error) {
    tokenStore.clear();
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    throw error;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Если находимся на странице auth, не пытаемся обновлять токен
      const isOnAuthPage = currentPath.startsWith('/auth');
      
      if (isOnAuthPage) {
        return Promise.reject(error);
      }
      
      // Если это первая попытка и мы еще не обновляем токен
      if (!originalRequest._retry && !isRefreshing) {
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          // Пытаемся обновить токен
          const newToken = await refreshAccessToken();
          
          // Обновляем заголовок авторизации в оригинальном запросе
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Обрабатываем все ожидающие запросы
          processQueue(null, newToken);
          isRefreshing = false;
          
          // Повторяем оригинальный запрос с новым токеном
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Если не удалось обновить токен
          processQueue(refreshError, null);
          isRefreshing = false;
          
          // Очищаем токен
          tokenStore.clear();
          
          // Перенаправляем на страницу авторизации, если не на ней уже
          if (typeof window !== 'undefined' && !isOnAuthPage) {
            // Сохраняем текущий путь для возврата после авторизации
            sessionStorage.setItem('redirectPath', currentPath);
            window.location.href = "/auth/login";
          }
          
          return Promise.reject(refreshError);
        }
      }
      
      // Если токен уже обновляется, добавляем запрос в очередь
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token: any) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
    }
    
    return Promise.reject(error);
  }
);


export const clientApi = makeApiWithHandler(apiClient);

// Функция для принудительного обновления токена
export const forceTokenRefresh = async () => {
  try {
    const newToken = await refreshAccessToken();
    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

// Функция для выхода
export const logout = async () => {
  try {
    // Опционально: отправляем запрос на сервер для инвалидации токена
    await apiClient.post('/api/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Очищаем токен
    tokenStore.clear();
    
    // Перенаправляем на страницу авторизации
    if (typeof window !== 'undefined') {
      window.location.href = "/auth/login";
    }
  }
};