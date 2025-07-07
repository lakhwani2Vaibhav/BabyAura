"use client";
import {
  createContext,
  useContext,
} from "react";

export type UserRole = "Parent" | "Doctor" | "Admin" | "Superadmin" | null;

export interface AuthContextType {
  role: UserRole;
  login: (role: NonNullable<UserRole>) => void;
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
