
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BabyAuraLogo } from "@/components/icons/BabyAuraLogo";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu } from "lucide-react";
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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NotificationBell } from "./NotificationBell";

const Rupee = () => <span className="font-sans">₹</span>;

export function DoctorHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useAuth();

  const getInitials = (role: string | null) => {
    if (!role) return "U";
    return role.substring(0, 1).toUpperCase();
  };

  const isNavItemActive = (navItemPath: string, matchFn?: (pathname: string) => boolean) => {
    if (matchFn) {
      return matchFn(pathname);
    }
    return pathname === navItemPath;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/doctor/dashboard"
              className="flex items-center space-x-2"
            >
              <BabyAuraLogo />
            </Link>
            {doctorHeaderNav.map((item) => {
               const Icon = item.label === 'Earnings' ? Rupee : item.icon;
               return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "transition-colors hover:text-foreground/80 flex items-center gap-1",
                      isNavItemActive(item.href, item.match)
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                  >
                    {item.label !== 'Earnings' && <Icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
               )
            })}
          </nav>

          <div className="flex items-center gap-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <SheetClose asChild>
                      <Link
                        href="/doctor/dashboard"
                        className="flex items-center"
                      >
                        <BabyAuraLogo />
                      </Link>
                    </SheetClose>
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium pt-6">
                  {doctorHeaderNav.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                          isNavItemActive(item.href, item.match) && "bg-muted text-primary"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/doctor/dashboard" className="md:hidden">
              <BabyAuraLogo />
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="https://placehold.co/40x40.png"
                    data-ai-hint="doctor smiling"
                    alt="@doctor"
                  />
                  <AvatarFallback>{getInitials(role)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{role}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    doctor@babyaura.in
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/doctor/settings")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Settings & Profile</span>
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
