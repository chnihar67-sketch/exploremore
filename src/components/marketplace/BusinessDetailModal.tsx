import React from 'react';
import { Business } from '../../types';
import { X, MapPin, Star, Phone, Mail, CheckCircle, ShieldCheck, Heart, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BusinessDetailModalProps {
  business: Business | null;
  onClose: () => void;
  onBook: (biz: Business) => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  onClose,
  onBook,
}) => {
  const { isBusinessSaved, toggleSaveBusiness } = useAuth();

  if (!business) return null;

  const isSaved = isBusinessSaved(business.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#faf7f2] w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#2d5a43] uppercase tracking-wider">
              {business.category.replace('_', ' ')}
            </span>
            {business.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#1b4332] bg-[#e7efe9] px-2 py-0.5 rounded font-semibold">
                <CheckCircle className="w-3 h-3 text-[#2d5a43]" />
                Verified Local Business
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSaveBusiness(business.id)}
              className="p-2 rounded-xl text-stone-600 hover:text-red-500 hover:bg-stone-100 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isSaved ? 'fill-red-500 text-red-500' : 'text-stone-600'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight mb-2">
              {business.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-1 text-stone-900 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="tabular-nums">{business.rating.toFixed(1)}</span>
                <span className="text-stone-400 font-normal">({business.reviewCount} reviews)</span>
              </div>
              <span>&middot;</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2d5a43]" />
                <span>{business.location}</span>
              </div>
              <span>&middot;</span>
              <div className="flex items-center gap-1 text-stone-700">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Status: <strong className="text-[#2d5a43]">{business.availability}</strong></span>
              </div>
            </div>
          </div>

          {/* Photo gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl overflow-hidden">
            {business.images.map((img, i) => (
              <div key={i} className="aspect-4/3 overflow-hidden bg-stone-100 rounded-xl">
                <img
                  src={img}
                  alt={`${business.name} photo ${i + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Host & Description */}
          <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Managed By</div>
              <div className="text-sm font-semibold text-stone-900">{business.ownerName}</div>
              <div className="text-xs text-stone-500">Local Entrepreneur &middot; Shivamogga, Karnataka</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-stone-400">Direct Contact</div>
              <div className="text-xs font-medium text-stone-800">{business.contactPhone}</div>
              <div className="text-[11px] text-stone-500">{business.contactEmail}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-serif font-bold text-stone-900 mb-2">Description &amp; Experience</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {business.description}
            </p>
          </div>

          {/* Services & Amenities */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5 font-sans">
              Services &amp; Inclusions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {business.amenitiesOrServices.map((amenity, i) => (
                <div key={i} className="p-2.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#2d5a43] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Booking CTA footer bar */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-stone-500">Official Direct Rate</div>
              <div className="text-2xl font-serif font-bold text-[#1b4332]">
                ₹{business.price.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-sans font-normal text-stone-600">
                  {business.priceUnit}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onBook(business);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-98"
            >
              Submit Booking Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
