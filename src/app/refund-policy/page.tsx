import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Lena Promoters Private Limited",
  description: "Refund and Cancellation Policy of Lena Promoters Private Limited.",
};

export default function RefundPolicyPage() {
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
              <RefreshCw size={28} className="text-white/90" />
              <h1 className="text-3xl md:text-4xl font-bold">Refund & Cancellation Policy</h1>
            </div>
          </div>
          <p className="text-white/80 max-w-2xl">
            Our policy regarding cancellations and refunds for plot bookings and registrations.
          </p>
          <p className="text-white/60 text-sm mt-3">Last updated: May 21, 2026</p>
        </div>
      </div>

      <div className="container-custom py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Booking Cancellation</h2>
            <p className="text-gray-600 leading-relaxed">
              Customers may request cancellation of plot bookings under the following terms:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>Cancellation requests must be submitted in writing via email or registered post.</li>
              <li>The buyer must provide the original receipt and booking details.</li>
              <li>Cancellation will be processed only after verification of all documents.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Refund Eligibility</h2>
            <p className="text-gray-600 leading-relaxed">
              Refund will be processed based on the cancellation timeline:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li><strong>Within 7 days of booking:</strong> 90% of token amount refunded (10% admin charges).</li>
              <li><strong>Between 8-30 days:</strong> 75% of token amount refunded.</li>
              <li><strong>After 30 days:</strong> Refund subject to management approval and prevailing market conditions.</li>
              <li><strong>After registration:</strong> Refunds are not applicable as per legal procedures.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Refund Processing Time</h2>
            <p className="text-gray-600 leading-relaxed">
              Approved refunds will be processed within <strong>30-45 working days</strong> from the date of cancellation approval. The amount will be transferred to the original payment account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Non-Refundable Charges</h2>
            <p className="text-gray-600 leading-relaxed">
              The following charges are <strong>non-refundable</strong>:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>Government registration charges</li>
              <li>Stamp duty paid to the government</li>
              <li>Documentation and processing fees</li>
              <li>GST and other applicable taxes</li>
              <li>Brokerage or referral fees (if applicable)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Project Delays</h2>
            <p className="text-gray-600 leading-relaxed">
              In the unlikely event of a project being delayed or cancelled by the company, customers will be entitled to a full refund of the amount paid, along with interest as per RERA guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Force Majeure</h2>
            <p className="text-gray-600 leading-relaxed">
              The company shall not be liable for delays or cancellations due to circumstances beyond reasonable control such as natural disasters, government regulations, or other force majeure events.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Dispute Resolution</h2>
            <p className="text-gray-600 leading-relaxed">
              Any disputes regarding refunds will be resolved through mutual discussion. If unresolved, disputes shall be subject to the jurisdiction of courts in Karaikudi, Tamil Nadu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact for Refunds</h2>
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
