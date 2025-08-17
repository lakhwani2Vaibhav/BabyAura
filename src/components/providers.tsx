
"use client";

import {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  ComponentType,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext, useAuth, UserRole, User } from "@/hooks/use-auth";
import { jwtDecode } from 'jwt-decode';
import { SuspendedAccountOverlay } from "./auth/SuspendedAccountOverlay";

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
  const [isSuspended, setIsSuspended] = useState(false);
  const router = useRouter();

  const checkUserStatus = useCallback(async (token: string, userRole: UserRole) => {
    if (userRole === 'Parent' || userRole === 'Superadmin') {
      // Parents and Superadmins are not suspended based on hospital status
      setIsSuspended(false);
      return;
    }

    // Admins and Doctors need their hospital's status checked
    try {
        const response = await fetch('/api/auth/status', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 403) {
            setIsSuspended(true);
        } else {
            setIsSuspended(false);
        }
    } catch (e) {
        console.error("Failed to verify user status", e);
        // Default to not suspended if status check fails, to avoid locking out users due to network issues
        setIsSuspended(false);
    }
  }, []);


  useEffect(() => {
    try {
      const token = localStorage.getItem("babyaura_token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
            const currentUser = { 
                userId: decodedToken.userId,
                role: decodedToken.role, 
                name: decodedToken.name, 
                email: decodedToken.email,
                hospitalName: decodedToken.hospitalName
            };
            setUser(currentUser);
            // Check status for authenticated users
            checkUserStatus(token, currentUser.role);
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
  }, [checkUserStatus]);

  const login = useCallback(
    (userInfo: { token: string, user: User }) => {
      localStorage.setItem("babyaura_token", userInfo.token);
      const newUser = { 
          userId: userInfo.user.userId,
          role: userInfo.user.role, 
          email: userInfo.user.email, 
          name: userInfo.user.name, 
          hospitalName: userInfo.user.hospitalName 
      };
      setUser(newUser);
      setIsSuspended(false); // Assume not suspended on fresh login
      if(newUser.role) {
        router.push(roleRedirects[newUser.role]);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("babyaura_token");
    setUser(null);
    setIsSuspended(false);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isSuspended }}>
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
    const { user, loading, isSuspended } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
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
        if (userDashboard && pathname !== userDashboard) {
           router.push(userDashboard);
        } else if (!userDashboard) {
           router.push(loginPath);
        }
      }
    }, [user, loading, allowedRoles, loginPath, router, pathname]);

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
    
    if (isSuspended) {
        return <SuspendedAccountOverlay />;
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
