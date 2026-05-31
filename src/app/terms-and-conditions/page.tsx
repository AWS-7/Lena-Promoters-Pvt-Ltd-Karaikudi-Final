import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Lena Promoters Private Limited",
  description: "Terms and Conditions for using Lena Promoters Private Limited services and website. Read our booking, payment and plot purchase terms.",
  keywords: "terms and conditions Lena Promoters, plot booking terms Karaikudi, land purchase agreement Tamil Nadu, real estate terms",
  alternates: {
    canonical: "https://www.lenapromoterspvtltd.com/terms-and-conditions",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-[#1195db] to-[#0a5480] text-white py-12">
        <div className="container-custom">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <img src="/logo.png" alt="Lena Promoters Logo" className="h-12 w-auto" />
            <div className="flex items-center gap-3">
              <FileText size={28} className="text-white/90" />
              <h1 className="text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
            </div>
          </div>
          <p className="text-white/80 max-w-2xl">
            Please read these terms and conditions carefully before using our website and services.
          </p>
          <p className="text-white/60 text-sm mt-3">Last updated: May 21, 2026</p>
        </div>
      </div>

      <div className="container-custom py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using the website of Lena Promoters Private Limited, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use of Website</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>You must be at least 18 years old to use our services.</li>
              <li>You agree to provide accurate and complete information.</li>
              <li>You shall not misuse the website for any unlawful activity.</li>
              <li>You shall not copy, reproduce, or distribute content without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Property Information</h2>
            <p className="text-gray-600 leading-relaxed">
              All property details, layouts, prices, and availability shown on our website are subject to change without notice. The information provided is for reference only and does not constitute a legal offer. Final terms will be confirmed in writing during booking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Booking & Payments</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>All bookings are subject to availability and confirmation.</li>
              <li>Token amount is required to confirm a plot booking.</li>
              <li>Payment terms will be specified in the sale agreement.</li>
              <li>Registration charges, stamp duty, and taxes are extra.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Approvals & Documentation</h2>
            <p className="text-gray-600 leading-relaxed">
              Our projects are duly approved by relevant authorities (DTCP, RERA, Local Body, Panchayat). Approval numbers and documents will be provided during booking. Buyers are encouraged to verify all approvals independently before committing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on this website including text, images, logos, and designs are the property of Lena Promoters Private Limited and are protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              Lena Promoters Private Limited shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services. Our total liability shall not exceed the amount paid by you for the specific service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Karaikudi, Tamil Nadu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to update these Terms and Conditions at any time. Changes will be effective upon posting to the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Lena Promoters Private Limited</strong></p>
              <p>No:49/3 Keelamel, 100 Feet Road, Soodamanipuram, Karaikudi - 630001</p>
              <p>Phone: +91 814 874 8140 / +91 814 814 8140</p>
              <p>Email: lenapromoterspvtltd@gmail.com</p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
