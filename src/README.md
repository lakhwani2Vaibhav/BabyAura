# BabyAura: Digital Postnatal Care Platform

BabyAura is a comprehensive, plug-and-play digital care ecosystem designed to connect hospitals, doctors, and parents. It provides a subscription-based infant e-care system that enables hospitals to offer continuous, structured postnatal and early childhood care to families after they've been discharged.

## Core Mission

Our mission is to bridge the gap between hospital and home, providing peace of mind to parents and empowering healthcare professionals with efficient, modern tools. We aim to make the early stages of parenthood a more connected, confident, and supported experience.

## Key User Roles

The platform is built around four key user roles, each with a dedicated portal and feature set:

1.  **Parents**: The primary users of the platform, receiving continuous care for their child. They can track milestones, consult with doctors, and manage their baby's health records.
2.  **Doctors**: Healthcare professionals who provide care through the platform. They can manage their patients, conduct tele-consultations, and issue digital prescriptions.
3.  **Hospital Admins**: Administrators who manage their hospital's presence on the platform. They oversee doctor and parent onboarding, view hospital-specific analytics, and manage billing.
4.  **Superadmins**: Platform owners who have a complete overview of the system. They manage hospital partnerships, monitor platform-wide analytics, and ensure quality control.

## Main Features

### For Parents
- **Interactive Dashboard**: A central hub showing the baby's weekly journey, upcoming appointments, and vaccination reminders.
- **AI-Powered Timeline**: A dynamic daily checklist that parents can update using natural language commands.
- **Tele-Consultations**: Secure video appointments with their trusted pediatricians and specialists.
- **AI Scrapbook**: Capture and cherish memories with AI-assisted captions for photos and videos.
- **Growth & Vaccination Tracking**: Monitor developmental milestones and stay on top of immunization schedules.
- **Secure Messaging**: Direct and secure communication channels with the assigned care team.

### For Doctors
- **Patient Management**: A comprehensive overview of all assigned patients, including their health records and growth charts.
- **Digital Prescriptions**: Efficiently create, manage, and renew e-prescriptions.
- **Appointments & Scheduling**: Manage consultation schedules and view upcoming appointments.
- **Earnings Dashboard**: Track revenue and view payout history.

### For Hospital Admins
- **Analytics Dashboard**: Monitor key hospital metrics like doctor activity, parent engagement, and revenue.
- **User Management**: Onboard and manage doctor and parent accounts associated with the hospital.
- **Billing & Partnership**: View invoice history and manage the hospital's partnership model.
- **Profile Management**: Control the hospital's public-facing information and available specialties.

### For Superadmins
- **Platform Oversight**: A global dashboard with analytics covering all hospitals and users.
- **Hospital Management**: Approve, manage, and monitor all partner hospitals.
- **Verification & KYC**: Review and verify documents submitted by hospitals to activate their accounts.
- **Usage Logs**: Access system-wide logs for monitoring and security.

## Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/) with the App Router, [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/).
- **UI**: [shadcn/ui](https://ui.shadcn.com/) component library, styled with [Tailwind CSS](https://tailwindcss.com/).
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) utilizing Google's Gemini models for features like the AI Scrapbook Helper.
- **Database**: [MongoDB](https://www.mongodb.com/) for data persistence.
- **Authentication**: JWT-based authentication with role-based access control.
- **Email**: [Brevo](https://www.brevo.com/) for transactional emails (welcome, password reset, notifications).

## Getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up your `.env` file with the required environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.).
4.  Run the development server: `npm run dev`

The application will be available at `http://localhost:9002`.
