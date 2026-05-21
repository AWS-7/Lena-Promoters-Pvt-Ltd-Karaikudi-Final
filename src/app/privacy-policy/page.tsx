import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Lena Promoters Private Limited",
  description: "Privacy Policy of Lena Promoters Private Limited. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1195db] to-[#0a5480] text-white py-12">
        <div className="container-custom">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <img src="/logo.png" alt="Lena Promoters Logo" className="h-12 w-auto" />
            <div className="flex items-center gap-3">
              <Shield size={28} className="text-white/90" />
              <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            </div>
          </div>
          <p className="text-white/80 max-w-2xl">
            Lena Promoters Private Limited is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
          </p>
          <p className="text-white/60 text-sm mt-3">Last updated: May 21, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              We may collect the following types of information when you use our website or services:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li><strong>Personal Information:</strong> Name, phone number, email address, and mailing address.</li>
              <li><strong>Property Preferences:</strong> Plot size, budget, location preferences.</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, interactions with our website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>To respond to your enquiries and provide customer support.</li>
              <li>To share property details, site visit schedules, and offers.</li>
              <li>To process bookings and registrations.</li>
              <li>To improve our website and services.</li>
              <li>To send promotional communications (with your consent).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>Our internal team members for processing your requests.</li>
              <li>Government authorities when required by law.</li>
              <li>Service providers who assist in website operations (under confidentiality agreements).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes secure servers, encryption, and regular security reviews.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect certain features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your personal information.</li>
              <li>Opt-out of marketing communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="mt-3 space-y-2 text-gray-600">
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
