// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (userData) => setCurrentUser(userData);
  const logout = () => setCurrentUser(null);
  const updateProfile = (updated) => setCurrentUser(updated);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
