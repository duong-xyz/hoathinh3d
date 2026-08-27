import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { loginUser, clearError } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
    
  };

  if (isAuthenticated) {
      navigate("/admin/movies");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng nhập (Redux Toolkit)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          if (error) dispatch(clearError());
          setUsername(e.target.value);
        }}
        autoComplete='username'
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          if (error) dispatch(clearError());
          setPassword(e.target.value);
        }}
        autoComplete="current-password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Login'}
      </button>
    </form>
  );
};