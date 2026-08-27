import axiosClient from './axiosClient';
import type { Page } from '../types/movie';
import type {
  UserResponseDto,
  UserCreateRequest,
  UserUpdateRequest,
  UserChangePasswordRequest,
} from '../types/user';

export const userApi = {
  getAllUsers: (page = 0, size = 20) =>
    axiosClient.get<Page<UserResponseDto>>(`/users`, {
      params: { page, size, sort: 'id,desc' },
    }),

  getUserById: (id: number) =>
    axiosClient.get<UserResponseDto>(`/users/${id}`),

  createUser: (data: UserCreateRequest) =>
    axiosClient.post<UserResponseDto>(`/users`, data),

  updateUser: (id: number, data: UserUpdateRequest) =>
    axiosClient.put<UserResponseDto>(`/users/${id}`, data),

  changePassword: (id: number, data: UserChangePasswordRequest) =>
    axiosClient.put<void>(`/users/${id}/change-password`, data),

  deleteUser: (id: number) =>
    axiosClient.delete<void>(`/users/${id}`),
};