/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
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
      const parsed = JSON.parse(storedUser);
      console.log('Loaded user from localStorage:', parsed);
      return parsed;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);

    if (nextUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (payload) => {
    const response = await loginUser(payload);
    persistUser(response.user);
    return response.user;
  }, [persistUser]);

  const register = useCallback(async (payload) => {
    const response = await registerUser(payload);
    return response.user;
  }, []);

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  const updateUserAvatar = useCallback((avatarUrl) => {
    setUser((currentUser) => {
      if (!currentUser || currentUser.avatarUrl === avatarUrl) {
        return currentUser;
      }

      const updatedUser = { ...currentUser, avatarUrl };
      console.log('Updating user avatar:', avatarUrl);
      console.log('Updated user:', updatedUser);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isBootstrapped: true,
    login,
    register,
    logout,
    updateUserAvatar,
  }), [login, logout, register, updateUserAvatar, user]);

  return (
    <AuthContext.Provider value={value}>
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
