"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BabyAuraLogo } from "@/components/icons/BabyAuraLogo";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { doctorHeaderNav } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DoctorHeader() {
  const pathname = usePathname();
  const { role, logout } = useAuth();
  
  const getInitials = (role: string | null) => {
    if (!role) return "U";
    return role.substring(0, 1).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex">
          <Link href="/doctor/dashboard" className="flex items-center space-x-2">
            <BabyAuraLogo />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {doctorHeaderNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="doctor smiling" alt="@doctor" />
                    <AvatarFallback>{getInitials(role)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{role}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      doctor@babyaura.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
