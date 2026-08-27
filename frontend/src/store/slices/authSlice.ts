import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../api/axiosClient';
import type { AuthState, LoginRequest, LoginResponse, UserProfile } from '../../types/auth';

interface JwtPayload {
  sub: string;
  scope?: string;
  exp: number;
  id: number;
}

// Helper decode JWT Token
const decodeUserFromToken = (token: string): UserProfile | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp * 1000 < Date.now()) return null;
    return {
      username: decoded.sub,
      role: decoded.scope || 'ROLE_USER',
      id: decoded.id
    };
  } catch {
    return null;
  }
};

// Khôi phục token ban đầu từ LocalStorage
const initialToken = localStorage.getItem('token');
const initialUser = initialToken ? decodeUserFromToken(initialToken) : null;

const initialState: AuthState = {
  token: initialToken,
  user: initialUser,
  isAuthenticated: !!initialUser,
  loading: false,
  error: null,
};

// Async Thunk xử lý Đăng nhập
export const loginUser = createAsyncThunk<
  { token: string; user: UserProfile },
  LoginRequest,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<LoginResponse>('/auth/login', credentials);
    const { token } = response.data;
    const user = decodeUserFromToken(token);

    if (!user) {
      return rejectWithValue('Token không hợp lệ hoặc đã hết hạn');
    }

    localStorage.setItem('token', token);
    return { token, user };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Đăng nhập thất bại');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đã có lỗi xảy ra';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;