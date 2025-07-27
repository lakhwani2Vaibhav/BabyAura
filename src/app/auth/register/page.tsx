import { RegisterForm } from '@/components/auth/RegisterForm';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <BabyAuraLogo />
          </Link>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
