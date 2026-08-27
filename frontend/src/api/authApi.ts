import axiosClient from './axiosClient';
import type { LoginResponse } from '../types/auth';

export const authApi = {
  login: (username: string, password: string) => {
    // Truyền Generic Type <LoginResponse> để TS biết res.data gồm những field nào
    return axiosClient.post<LoginResponse>('/auth/login', { username, password });
  },
};