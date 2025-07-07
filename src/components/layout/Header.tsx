"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { capitalize } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length > 1) {
      const title = parts[parts.length - 1];
      return capitalize(title.replace(/-/g, " "));
    }
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div>
        <h1 className="text-xl font-semibold font-headline">
          {getPageTitle(pathname)}
        </h1>
      </div>
    </header>
  );
}
