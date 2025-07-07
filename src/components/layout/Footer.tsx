import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
                <h4 className="font-semibold text-foreground">For Parents</h4>
                <nav className="flex flex-col gap-3">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Consultations</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Health Records</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Vaccinations</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Emergency Care</Link>
                </nav>
            </div>
            <div className="flex flex-col gap-4">
                <h4 className="font-semibold text-foreground">For Hospitals</h4>
                <nav className="flex flex-col gap-3">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Partnership</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Revenue Models</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Analytics</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</Link>
                </nav>
            </div>
            <div className="flex flex-col gap-4">
                <h4 className="font-semibold text-foreground">Company</h4>
                <nav className="flex flex-col gap-3">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                </nav>
            </div>
        </div>
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} BabyAura. All rights reserved. Empowering families, transforming healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
}
