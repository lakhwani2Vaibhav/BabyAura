import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'BabyAura: Digital Postnatal & Baby Care Platform | India',
  description:
    'BabyAura is a leading digital care ecosystem in India, connecting hospitals and parents for seamless postnatal and baby care. Get expert consultations, vaccination tracking, and 24/7 support with Aura Baby.',
  keywords: [
      'babyaura',
      'baby aura',
      'aura baby',
      'postnatal care',
      'infant care',
      'digital health',
      'pediatrician online',
      'childcare platform',
      'hospital e-care',
      'newborn care India',
      'telemedicine India'
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
