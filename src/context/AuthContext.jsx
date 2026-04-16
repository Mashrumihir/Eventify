/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);
const STORAGE_KEY = 'eventify-auth-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = window.localStorage.getItem(STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const persistUser = (nextUser) => {
    setUser(nextUser);

    if (nextUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async (payload) => {
    const response = await loginUser(payload);
    persistUser(response.user);
    return response.user;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    persistUser(response.user);
    return response.user;
  };

  const logout = () => {
    persistUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isBootstrapped: true,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
