import axios from 'axios';

const axiosClient = axios.create({
  // baseURL: 'http://localhost:8080/api/v1',
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://180.93.35.213:8080/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined' && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Response Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;