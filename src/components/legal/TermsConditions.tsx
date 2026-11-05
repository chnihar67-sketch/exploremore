import React from 'react';
import { ArrowLeft, Scale, AlertCircle, FileCheck, CheckCircle } from 'lucide-react';

interface TermsConditionsProps {
  onBack: () => void;
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({ onBack }) => {
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
              Legal &middot; Agreement
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-stone-500 mt-2">
              Effective Date: November 2026 &middot; Governed under the laws of the State of Karnataka, India
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              1. Platform Scope &amp; Role
            </h2>
            <p>
              Localora is a marketplace platform facilitating direct discovery and bookings between independent travelers and registered local tourism businesses (homestays, certified nature guides, traditional dining establishments, and transport cooperatives). Localora is neither a travel agency nor a tour operator.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              2. Host &amp; Business Obligations
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li>All listed businesses must maintain valid permits from local authorities (Gram Panchayat, Karnataka Forest Department, or Food Safety and Standards Authority of India where applicable).</li>
              <li>Hosts agree to honor quoted rates and specified amenities without unauthorized on-site surcharges.</li>
              <li>Hosts reserve the right to accept or decline booking requests based on genuine lodging capacity and seasonal safety guidelines.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              3. Guest Code of Conduct &amp; Eco Preservation
            </h2>
            <p>
              The Western Ghats of Karnataka represent an ecologically sensitive biosphere. All travelers booking through Localora agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li>Adhere to a strict <strong>Zero-Plastic Policy</strong> on all hiking trails, waterfalls, and reserve forests.</li>
              <li>Respect sacred monument codes at ancient temples, Jain basadis, and Keladi heritage forts.</li>
              <li>Follow certified local guides during jungle treks and refrain from wandering off marked forest trails.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              4. Booking Requests &amp; Cancellation Policy
            </h2>
            <p>
              Booking requests submitted via Localora are confirmed upon explicit acceptance by the host in their dashboard. Cancellations made more than 48 hours prior to check-in incur zero platform penalty.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              5. Dispute Resolution
            </h2>
            <p>
              Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the civil courts of Shivamogga, Karnataka.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-200 text-xs text-stone-500">
            Questions regarding platform legal guidelines? Email <span className="font-mono text-stone-900">legal@localora.org</span>.
          </div>
        </div>
      </div>
    </div>
  );
};
