
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type UserRole = "Parent" | "Doctor" | "Admin" | "Superadmin" | null;

// Add a user object to store more than just the role
export interface User {
  role: UserRole;
  email?: string;
  name?: string;
  hospitalName?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userInfo: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
