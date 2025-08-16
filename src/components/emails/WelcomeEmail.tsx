
import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
  role: 'Parent' | 'Doctor' | 'Admin';
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({ name, role }) => {
  return (
    <html lang="en">
      <body>
        <h1>Welcome to BabyAura, {name}!</h1>
        <p>We're excited to have you on board as a {role}.</p>
        <p>You can now log in to your account.</p>
        <p>Best,<br />The BabyAura Team</p>
      </body>
    </html>
  );
};
