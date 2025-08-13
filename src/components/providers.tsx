
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
import { jwtDecode } from 'jwt-decode';

const roleRedirects: Record<NonNullable<UserRole>, string> = {
  Parent: "/parent/dashboard",
  Doctor: "/doctor/dashboard",
  Admin: "/admin/dashboard",
  Superadmin: "/superadmin/dashboard",
};

interface DecodedToken extends User {
    exp: number;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("babyaura_token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
            setUser({ 
                role: decodedToken.role, 
                name: decodedToken.name, 
                email: decodedToken.email,
                hospitalName: decodedToken.hospitalName
            });
        } else {
             localStorage.removeItem("babyaura_token");
        }
      }
    } catch (e) {
      console.error("Could not access localStorage or decode token", e);
      localStorage.removeItem("babyaura_token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    (userInfo: { token: string, user: User }) => {
      localStorage.setItem("babyaura_token", userInfo.token);
      const newUser = { 
          role: userInfo.user.role, 
          email: userInfo.user.email, 
          name: userInfo.user.name, 
          hospitalName: userInfo.user.hospitalName 
      };
      setUser(newUser);
      if(newUser.role) {
        router.push(roleRedirects[newUser.role]);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("babyaura_token");
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
