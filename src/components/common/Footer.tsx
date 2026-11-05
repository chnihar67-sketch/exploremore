import React from 'react';
import { Compass, Heart, ShieldCheck, Leaf, MapPin, Mail, Globe, Lock, FileText } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenCustomDomain?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCustomDomain }) => {
  return (
    <footer className="bg-[#14281f] text-stone-300 pt-16 pb-12 border-t border-[#234835]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[#234835]/80">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#2d5a43] flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                LOCALORA
              </span>
            </div>
            <p className="text-xs text-stone-300/80 leading-relaxed">
              Karnataka local tourism portal. Direct bookings with plantation homestays, verified nature and heritage guides, and traditional kitchens across the Western Ghats, Karavali, and Deccan heritage corridors.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#52b788]" />
                <span>Karnataka, India (Statewide Tourism Network)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#52b788]" />
                <span>contact@localora.org</span>
              </div>
            </div>
          </div>

          {/* Regional Hubs */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase font-sans mb-4">
              Explore By Region
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300/80">
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors"
                >
                  Vijayanagara &middot; Hampi UNESCO &amp; Boulders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors"
                >
                  Uttara Kannada &middot; Gokarna Om Beach &amp; Cliffs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors"
                >
                  Kodagu &middot; Coorg Coffee Hills &amp; Kaveri
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors"
                >
                  Bagalkote &middot; Badami Cave Temples
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors"
                >
                  Shivamogga &middot; Jog Falls &amp; Agumbe Rainforest
                </button>
              </li>
            </ul>
          </div>

          {/* Local Marketplace & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase font-sans mb-4">
              Directory &amp; Compliance
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300/80">
              <li>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-white transition-colors"
                >
                  Verified Plantation Homestays
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-white transition-colors"
                >
                  Certified Naturalist Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-[#52b788]" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-[#52b788]" />
                  <span>Terms &amp; Conditions</span>
                </button>
              </li>
              {onOpenCustomDomain && (
                <li>
                  <button
                    onClick={onOpenCustomDomain}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-[#52b788]"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Custom Domain Settings</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Community Standards */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase font-sans mb-4">
              Community Standards
            </h4>
            <div className="space-y-3 text-xs text-stone-300/80">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#52b788] shrink-0 mt-0.5" />
                <span>Verified business profiles audited by district tourism coordinators.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-[#52b788] shrink-0 mt-0.5" />
                <span>Direct guest-to-host settlement with zero broker commission fees.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Leaf className="w-4 h-4 text-[#52b788] shrink-0 mt-0.5" />
                <span>Strict Leave-No-Trace and plastic-free guidelines for forest reserves.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean, professional, zero AI tags */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Localora Tourism Portal. Preserving Karnataka&apos;s natural and cultural heritage and supporting rural livelihoods.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-stone-200">
              Privacy
            </button>
            <button onClick={() => onNavigate('terms')} className="hover:text-stone-200">
              Terms
            </button>
            <button
              onClick={() => onNavigate('hiddengems')}
              className="text-[#52b788] hover:underline"
            >
              Beyond The Map &rarr;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
