import { RegisterForm } from '@/components/auth/RegisterForm';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <BabyAuraLogo />
        </Link>
      </div>
      <RegisterForm />
    </div>
  );
}
