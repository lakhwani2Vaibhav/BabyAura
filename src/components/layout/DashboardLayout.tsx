"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import type { NavItem } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { BabyAuraLogo } from "../icons/BabyAuraLogo";
import { LogOut, User } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { role, logout } = useAuth();

  const getInitials = (role: string | null) => {
    if (!role) return "U";
    return role.substring(0, 1).toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <BabyAuraLogo />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={
                        item.match
                          ? item.match(pathname)
                          : pathname === item.href
                      }
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://placehold.co/40x40.png`} />
                    <AvatarFallback>{getInitials(role)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">{role}</p>
                    <p className="text-xs text-muted-foreground">
                      {role?.toLowerCase()}@babyaura.com
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="p-4 sm:p-6 lg:p-8 bg-muted/40 min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
