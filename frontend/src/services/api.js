import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
});

function isAuthRefreshRequest(config) {
  return config?.url?.includes('/auth/refresh');
}

function isAuthenticationRequest(config) {
  return config?.url?.includes('/auth/login') || config?.url?.includes('/auth/register');
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      !error.config?._retry &&
      !isAuthRefreshRequest(error.config) &&
      !isAuthenticationRequest(error.config);

    if (shouldAttemptRefresh) {
      error.config._retry = true;
      await api.post('/auth/refresh');
      return api(error.config);
    }

    throw error;
  },
);
