export type Role = 'USER' | 'ADMIN';

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  isActive: boolean;
  role: Role;
  createdAt?: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  avatarUrl?: string;
  role?: Role;
}

export interface UserUpdateRequest {
  fullName?: string;
  avatarUrl?: string;
  isActive?: boolean;
  role?: Role;
}

export interface UserChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}