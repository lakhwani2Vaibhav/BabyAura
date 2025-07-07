import { LoginForm } from '@/components/auth/LoginForm';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <BabyAuraLogo />
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}
