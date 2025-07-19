
"use client";

import {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  ComponentType,
} from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext, useAuth, UserRole } from "@/hooks/use-auth";

const roleRedirects: Record<NonNullable<UserRole>, string> = {
  Parent: "/parent/dashboard",
  Doctor: "/doctor/dashboard",
  Admin: "/admin/dashboard",
  Superadmin: "/superadmin/dashboard",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("userRole") as UserRole;
      if (storedRole && Object.keys(roleRedirects).includes(storedRole)) {
        setRole(storedRole);
      }
    } catch (e) {
      console.error("Could not access localStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    (newRole: NonNullable<UserRole>) => {
      localStorage.setItem("userRole", newRole);
      setRole(newRole);
      router.push(roleRedirects[newRole]);
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("userRole");
    setRole(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: NonNullable<UserRole>[],
  options?: { loginPath?: string }
) {
  const WithAuthComponent = (props: P) => {
    const { role, loading } = useAuth();
    const router = useRouter();
    const loginPath = options?.loginPath || '/auth/login';

    useEffect(() => {
      if (loading) {
        return;
      }
      
      if (!role) {
        router.push(loginPath);
        return;
      }

      if (!allowedRoles.includes(role)) {
        // If user is logged in but with a wrong role, redirect to their own dashboard
        const userDashboard = roleRedirects[role];
        if (userDashboard) {
           router.push(userDashboard);
        } else {
           router.push(loginPath);
        }
      }
    }, [role, loading, router]);

    if (loading || !role || !allowedRoles.includes(role)) {
      return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;
  return WithAuthComponent;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
