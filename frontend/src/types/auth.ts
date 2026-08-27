export interface UserProfile {
  username: string;
  role: string;
  id: number;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  username: string;
  password: String;
}

export interface LoginResponse {
  token: string;
  type: string;
}

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
}