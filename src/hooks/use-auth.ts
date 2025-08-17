
"use client";
import {
  createContext,
  useContext,
} from "react";

export type UserRole = "Parent" | "Doctor" | "Admin" | "Superadmin" | null;

// Add a user object to store more than just the role
export interface User {
  userId: string;
  role: UserRole;
  email?: string;
  name?: string;
  hospitalName?: string;
  status?: 'active' | 'suspended' | 'rejected' | 'pending_verification';
}

export interface AuthContextType {
  user: User | null;
  login: (userInfo: { token: string, user: User }) => void;
  logout: () => void;
  loading: boolean;
  isSuspended: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
