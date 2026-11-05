import React from 'react';
import { Destination, Business } from '../../types';
import { X, MapPin, Calendar, Compass, ShieldCheck, Heart, Star, Navigation, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  businesses: Business[];
  onBookBusiness: (biz: Business) => void;
  onSelectBusiness: (biz: Business) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
  businesses,
  onBookBusiness,
  onSelectBusiness,
}) => {
  const { isDestinationSaved, toggleSaveDestination } = useAuth();

  if (!destination) return null;

  const isSaved = isDestinationSaved(destination.id);

  // Find linked nearby businesses
  const nearbyHomestays = businesses.filter((b) =>
    destination.nearbyHomestayIds?.includes(b.id)
  );
  const nearbyGuides = businesses.filter((b) =>
    destination.nearbyGuideIds?.includes(b.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#faf7f2] w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky top header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-[#2d5a43] uppercase tracking-wider">
              {destination.taluk} Taluk
            </span>
            <span>&middot;</span>
            <span className="capitalize">{destination.category.replace('_', ' ')}</span>
            {destination.isFeaturedHiddenGem && (
              <>
                <span>&middot;</span>
                <span className="text-[#1b4332] font-semibold">Featured Hidden Gem</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSaveDestination(destination.id)}
              className="p-2 rounded-xl text-stone-600 hover:text-red-500 hover:bg-stone-100 transition-colors"
              title={isSaved ? 'Saved to favorites' : 'Save to favorites'}
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

        {/* Scrollable Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Main Title & Image Gallery */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-2">
              {destination.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mb-6">
              <div className="flex items-center gap-1 text-stone-800 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="tabular-nums">{destination.rating.toFixed(2)}</span>
                <span className="text-stone-400 font-normal">({destination.reviewCount} reviews)</span>
              </div>
              <span>&middot;</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2d5a43]" />
                <span>{destination.taluk}, {destination.district} District</span>
              </div>
              <span>&middot;</span>
              <div>
                Estimated Budget: <span className="font-semibold text-stone-900">{destination.estimatedBudget}</span>
              </div>
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
              <div className="relative aspect-4/3 overflow-hidden bg-stone-200">
                <img
                  src={destination.image}
                  alt={destination.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {destination.gallery.slice(0, 2).map((imgUrl, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-stone-200">
                    <img
                      src={imgUrl}
                      alt={`${destination.name} photo ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="col-span-2 p-4 bg-[#eef5f0] border border-[#2d5a43]/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#2d5a43]" />
                    <span className="text-xs font-semibold text-[#1b4332]">GPS Coordinates:</span>
                    <span className="text-xs text-stone-600 tabular-nums">
                      {destination.coordinates.lat.toFixed(4)}° N, {destination.coordinates.lng.toFixed(4)}° E
                    </span>
                  </div>
                  <span className="text-[11px] text-[#2d5a43] font-medium">Western Ghats</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Key Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">About this Destination</h3>
                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {destination.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3 font-sans">
                  Key Highlights &amp; Secrets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {destination.highlights.map((h, i) => (
                    <div key={i} className="p-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 flex items-start gap-2">
                      <span className="text-[#2d5a43] font-bold">&bull;</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-2 font-sans">
                  Available Activities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {destination.activities.map((act, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Travel Logistics sidebar box */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200/90 space-y-4 h-fit">
              <h3 className="font-serif font-bold text-base text-stone-900 pb-2 border-b border-stone-100">
                Travel Logistics
              </h3>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Best Time To Visit</div>
                <div className="text-xs font-medium text-stone-800 mt-0.5">{destination.bestTimeToVisit}</div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Nearest Base Town</div>
                <div className="text-xs font-medium text-stone-800 mt-0.5">{destination.travelInfo.nearestTown}</div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Road &amp; Transit Access</div>
                <div className="text-xs text-stone-700 mt-0.5 leading-relaxed">{destination.travelInfo.roadAccess}</div>
              </div>

              {destination.travelInfo.trekDifficulty && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Trek Difficulty</div>
                  <div className="text-xs font-semibold text-[#2d5a43] mt-0.5">{destination.travelInfo.trekDifficulty}</div>
                </div>
              )}
            </div>
          </div>

          {/* Nearby Homestays & Guides */}
          <div className="pt-6 border-t border-stone-200 space-y-6">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Verified Stays &amp; Guides Near {destination.name}
            </h3>

            {nearbyHomestays.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                  Recommended Stays
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nearbyHomestays.map((biz) => (
                    <div
                      key={biz.id}
                      className="p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={biz.images[0]}
                          alt={biz.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-xs text-stone-900 line-clamp-1">{biz.name}</div>
                          <div className="text-[11px] text-stone-500">₹{biz.price} {biz.priceUnit.split('(')[0]}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onBookBusiness(biz);
                        }}
                        className="px-3 py-1.5 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold shrink-0"
                      >
                        Book Stay
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nearbyGuides.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                  Local Guides &amp; Treks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nearbyGuides.map((biz) => (
                    <div
                      key={biz.id}
                      className="p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={biz.images[0]}
                          alt={biz.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-xs text-stone-900 line-clamp-1">{biz.name}</div>
                          <div className="text-[11px] text-stone-500">Led by {biz.ownerName} &middot; ₹{biz.price}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onBookBusiness(biz);
                        }}
                        className="px-3 py-1.5 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold shrink-0"
                      >
                        Book Guide
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
