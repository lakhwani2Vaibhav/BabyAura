
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import { Menu, ShieldAlert } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function MarketingHeader() {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <Link href="/" className="flex items-center justify-center">
                <BabyAuraLogo />
            </Link>
            <nav className="hidden md:flex gap-4 sm:gap-6 items-center">
                <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4">
                    Features
                </Link>
                <Link href="/hospitals" className="text-sm font-medium hover:underline underline-offset-4">
                    Hospitals
                </Link>
                <Link href="/parents" className="text-sm font-medium hover:underline underline-offset-4">
                    Parents
                </Link>
                <Link href="/#pricing" className="text-sm font-medium hover:underline underline-offset-4">
                    Pricing
                </Link>
                <Button asChild variant="destructive" className="animate-wave-destructive">
                    <Link href="/emergency">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Emergency
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/auth/login">Login</Link>
                </Button>
            </nav>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>
                                <SheetClose asChild>
                                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                                        <BabyAuraLogo />
                                    </Link>
                                </SheetClose>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="grid gap-6 text-lg font-medium mt-6">
                            <SheetClose asChild>
                                <Link href="/features" className="text-muted-foreground hover:text-foreground">
                                    Features
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/hospitals" className="text-muted-foreground hover:text-foreground">
                                    For Hospitals
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/parents" className="text-muted-foreground hover:text-foreground">
                                    For Parents
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/#pricing" className="text-muted-foreground hover:text-foreground">
                                    Pricing
                                </Link>
                            </SheetClose>
                             <SheetClose asChild>
                                <Button asChild variant="destructive" className="justify-start gap-4 px-3 animate-wave-destructive">
                                    <Link href="/emergency">
                                        <ShieldAlert className="h-5 w-5" />
                                        Emergency
                                    </Link>
                                </Button>
                            </SheetClose>
                             <SheetClose asChild>
                                <Button asChild className="mt-4">
                                    <Link href="/auth/login">Login</Link>
                                </Button>
                            </SheetClose>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
