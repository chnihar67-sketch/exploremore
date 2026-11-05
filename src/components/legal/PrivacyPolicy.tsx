import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="py-12 bg-[#faf7f2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#2d5a43] hover:text-[#1b4332] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-stone-200/90 shadow-xs space-y-8 text-stone-800 text-sm leading-relaxed">
          <div>
            <div className="text-xs font-semibold text-[#2d5a43] uppercase tracking-wider mb-1">
              Legal &middot; Compliance
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-stone-500 mt-2">
              Last updated: November 2026 &middot; Operational jurisdiction: Karnataka, India
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              1. Information We Collect
            </h2>
            <p>
              Localora operates as a direct bridge connecting travelers with independent homestays, tour guides, and local businesses in Karnataka. When you use our platform, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li><strong>Contact Information</strong>: Name, phone number, and email address provided during account creation or booking requests.</li>
              <li><strong>Booking Details</strong>: Requested travel dates, party size, dietary preferences, and trip notes submitted to local hosts.</li>
              <li><strong>Listing Data (Hosts)</strong>: Property address, government verification documents, tax identification (where applicable), and photographs.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              2. How Your Data Is Used
            </h2>
            <p>
              We process personal information strictly to facilitate transparent, safe tourism services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li>To transmit booking inquiries directly to host dashboards for verification and confirmation.</li>
              <li>To prevent duplicate requests and spam bookings on community listings.</li>
              <li>To maintain compliance with Karnataka Tourism Department and local gram panchayat regulations.</li>
              <li>We do not sell, rent, or monetize personal traveler data to third-party ad networks.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              3. Payment &amp; Financial Security
            </h2>
            <p>
              Localora operates on a direct-to-host settlement model. No payment card numbers, UPI PINs, or bank account credentials are stored on our servers. All booking fees and local taxes are settled directly between traveler and verified business owner upon confirmation.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              4. Data Retention &amp; Traveler Rights
            </h2>
            <p>
              You maintain the right to review, export, or permanently delete your user account and booking history at any time through your dashboard or by emailing <span className="font-mono text-stone-900">privacy@localora.org</span>.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-200 text-xs text-stone-500">
            For privacy inquiries or grievance redressal, contact our Designated Grievance Officer: Localora Community Tourism Trust, Shivamogga, Karnataka 577201.
          </div>
        </div>
      </div>
    </div>
  );
};
