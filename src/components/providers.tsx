
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
import { AuthContext, useAuth, UserRole, User } from "@/hooks/use-auth";

const roleRedirects: Record<NonNullable<UserRole>, string> = {
  Parent: "/parent/dashboard",
  Doctor: "/doctor/dashboard",
  Admin: "/admin/dashboard",
  Superadmin: "/superadmin/dashboard",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("babyaura_user");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        if (parsedUser.role && Object.keys(roleRedirects).includes(parsedUser.role)) {
          setUser(parsedUser);
        }
      }
    } catch (e) {
      console.error("Could not access localStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    (userInfo: { role: NonNullable<UserRole>, email: string, name: string }) => {
      const newUser = { role: userInfo.role, email: userInfo.email, name: userInfo.name };
      localStorage.setItem("babyaura_user", JSON.stringify(newUser));
      setUser(newUser);
      router.push(roleRedirects[userInfo.role]);
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("babyaura_user");
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
    const { user, loading } = useAuth();
    const router = useRouter();
    const loginPath = options?.loginPath || '/auth/login';

    useEffect(() => {
      if (loading) {
        return;
      }
      
      if (!user || !user.role) {
        router.push(loginPath);
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        // If user is logged in but with a wrong role, redirect to their own dashboard
        const userDashboard = roleRedirects[user.role];
        if (userDashboard) {
           router.push(userDashboard);
        } else {
           router.push(loginPath);
        }
      }
    }, [user, loading, allowedRoles, loginPath, router]);

    if (loading || !user || !user.role || !allowedRoles.includes(user.role)) {
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
