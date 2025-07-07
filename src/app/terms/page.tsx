import { Footer } from "@/components/layout/Footer";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="prose prose-gray mx-auto max-w-4xl dark:prose-invert">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2 className="mt-8 text-2xl font-bold">1. Agreement to Terms</h2>
            <p>
              By using our application, you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the application.
            </p>

            <h2 className="mt-8 text-2xl font-bold">2. User Accounts</h2>
            <p>
              You are responsible for safeguarding your account and for any activities or actions under your account. You agree to provide accurate and complete information when you create an account.
            </p>

            <h2 className="mt-8 text-2xl font-bold">3. Medical Disclaimer</h2>
            <p>
              BabyAura provides informational content and tools but is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>

            <h2 className="mt-8 text-2xl font-bold">4. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="mt-8 text-2xl font-bold">5. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:support@babyaura.com" className="text-primary hover:underline">support@babyaura.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
