import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('luxestay_token');
    const savedUser  = localStorage.getItem('luxestay_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      authAPI.me().then(data => {
        setUser(data.user);
        localStorage.setItem('luxestay_user', JSON.stringify(data.user));
      }).catch(() => { _clear(); }).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const _clear = () => { setUser(null); setToken(null); localStorage.removeItem('luxestay_token'); localStorage.removeItem('luxestay_user'); };
  const login = async (email, password) => { const d = await authAPI.login({ email, password }); setUser(d.user); setToken(d.token); localStorage.setItem('luxestay_token', d.token); localStorage.setItem('luxestay_user', JSON.stringify(d.user)); return d.user; };
  const register = async (name, email, password, phone) => { const d = await authAPI.register({ name, email, password, phone }); setUser(d.user); setToken(d.token); localStorage.setItem('luxestay_token', d.token); localStorage.setItem('luxestay_user', JSON.stringify(d.user)); return d.user; };
  const logout = () => _clear();
  const updateUser = (u) => { setUser(u); localStorage.setItem('luxestay_user', JSON.stringify(u)); };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isLoggedIn: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
