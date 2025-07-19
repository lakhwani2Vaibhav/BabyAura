import { SuperAdminLoginForm } from '@/components/auth/SuperAdminLoginForm';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import Link from 'next/link';

export default function SuperAdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <BabyAuraLogo />
        </Link>
      </div>
      <SuperAdminLoginForm />
    </div>
  );
}
