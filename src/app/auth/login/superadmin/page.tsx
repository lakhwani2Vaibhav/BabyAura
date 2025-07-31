import { SuperAdminLoginForm } from '@/components/auth/SuperAdminLoginForm';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import Link from 'next/link';

export default function SuperAdminLoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted p-4">
       <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <BabyAuraLogo />
          </Link>
        </div>
        <SuperAdminLoginForm />
      </div>
    </div>
  );
}
