import { Footer } from "@/components/layout/Footer";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="prose prose-gray mx-auto max-w-4xl dark:prose-invert">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2 className="mt-8 text-2xl font-bold">1. Introduction</h2>
            <p>
              Welcome to BabyAura. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>

            <h2 className="mt-8 text-2xl font-bold">2. Information We Collect</h2>
            <p>
              We may collect personal identification information (Name, email address, phone number, etc.), health information related to your child (vaccination records, growth data, etc.), and other information you provide directly to us.
            </p>

            <h2 className="mt-8 text-2xl font-bold">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, operate, and maintain our services, to improve, personalize, and expand our services, and to communicate with you.
            </p>

            <h2 className="mt-8 text-2xl font-bold">4. Data Security</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information.
            </p>

            <h2 className="mt-8 text-2xl font-bold">5. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at <a href="mailto:privacy@babyaura.com" className="text-primary hover:underline">privacy@babyaura.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
