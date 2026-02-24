"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, UserDTO, LoginRequestDTO } from "./services/auth.service";

interface AuthContextType {
  user: UserDTO | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequestDTO) => Promise<UserDTO>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const isAuth = await authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
         try {
           const userData = await authService.getMe();
           setUser(userData);
         } catch (userErr) {
           console.error("Failed to fetch user data:", userErr);
           setUser(null);
           setIsAuthenticated(false);
         }
      } else {
         setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequestDTO) => {
    try {
      setLoading(true);
      const userData = await authService.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      // Optional: Since middleware handles protected routing, 
      // a hard reload or redirect to '/' might be useful here depending on UX needs.
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
