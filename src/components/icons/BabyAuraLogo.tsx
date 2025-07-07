import { Baby } from "lucide-react";

export const BabyAuraLogo = ({ className }: { className?: string }) => (
  <div
    className={`flex items-center gap-2 font-headline text-xl font-bold tracking-tight text-foreground ${className}`}
  >
    <div className="rounded-full bg-primary/20 p-1.5 text-primary">
      <Baby className="h-5 w-5" />
    </div>
    <span>BabyAura</span>
  </div>
);
