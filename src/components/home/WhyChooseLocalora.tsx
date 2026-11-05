import React from 'react';
import { ShieldCheck, HeartHandshake, Trees, PhoneCall } from 'lucide-react';

export const WhyChooseLocalora: React.FC = () => {
  const standards = [
    {
      icon: HeartHandshake,
      title: 'Direct Rural Host Revenue',
      description:
        'All booking inquiries connect directly to the local family or guide. There are no middleman commission deductions or inflated reseller prices.',
    },
    {
      icon: ShieldCheck,
      title: 'Physical Audit & Verification',
      description:
        'Every listed plantation homestay and certified trek leader is audited on-site for hygiene, guest safety, and authentic heritage accommodation.',
    },
    {
      icon: PhoneCall,
      title: 'Direct Telephone Contact',
      description:
        'Confirmed reservations include the verified direct mobile phone number of your host for transparent coordination before you arrive.',
    },
    {
      icon: Trees,
      title: 'Preserving Fragile Ghats',
      description:
        'We enforce strict Leave-No-Trace rules, plastic-free trekking codes, and support native biodiversity conservation projects.',
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold text-[#2d5a43] tracking-widest uppercase mb-2">
            Operational Standards
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            How Localora Works
          </h2>
          <p className="mt-2 text-stone-600 text-sm">
            Bridging conscious travelers directly with local hosts, traditional cooks, and certified guides across Karnataka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-xl bg-[#faf7f2] border border-stone-200/80 hover:border-stone-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#2d5a43]/10 text-[#2d5a43] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Verification Checklist */}
        <div className="mt-12 p-6 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-stone-700">
          <div>
            <div className="font-semibold text-stone-900 mb-1">Standardized Tariffs</div>
            <p className="text-stone-500 leading-relaxed">
              Rates are fixed by hosts and transparently published with meals and guided walks clearly itemized.
            </p>
          </div>
          <div>
            <div className="font-semibold text-stone-900 mb-1">Registered Forest &amp; Heritage Guides</div>
            <p className="text-stone-500 leading-relaxed">
              Trekking routes and heritage complexes across Agumbe, Kodachadri, Gokarna, and Hampi feature certified local leaders.
            </p>
          </div>
          <div>
            <div className="font-semibold text-stone-900 mb-1">Direct Settlement</div>
            <p className="text-stone-500 leading-relaxed">
              Payments are settled directly with the host upon check-in, keeping funds in the rural economy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
