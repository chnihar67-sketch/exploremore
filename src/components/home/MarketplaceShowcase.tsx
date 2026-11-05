import React, { useState } from 'react';
import { Business, BusinessCategory } from '../../types';
import { Star, MapPin, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MarketplaceShowcaseProps {
  businesses: Business[];
  onSelectBusiness: (biz: Business) => void;
  onBookBusiness: (biz: Business) => void;
  onViewAllMarketplace: (category?: BusinessCategory) => void;
}

export const MarketplaceShowcase: React.FC<MarketplaceShowcaseProps> = ({
  businesses,
  onSelectBusiness,
  onBookBusiness,
  onViewAllMarketplace,
}) => {
  const { isBusinessSaved, toggleSaveBusiness } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'all' | BusinessCategory>('all');

  const categories: { id: 'all' | BusinessCategory; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'homestay', label: 'Homestays' },
    { id: 'tour_guide', label: 'Local Guides' },
    { id: 'adventure', label: 'Adventure & 4x4' },
    { id: 'restaurant', label: 'Traditional Food' },
    { id: 'cultural', label: 'Culture & Heritage' },
    { id: 'handicraft', label: 'Local Crafts' },
  ];

  const filteredBusinesses = activeCategory === 'all'
    ? businesses.filter((b) => b.verified)
    : businesses.filter((b) => b.verified && b.category === activeCategory);

  return (
    <section className="py-20 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold text-[#2d5a43] tracking-widest uppercase mb-2">
              Direct Community Marketplace
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Stay, Eat &amp; Explore with Locals
            </h2>
            <p className="mt-2 text-stone-600 text-sm max-w-xl">
              100% of your booking supports rural hosts, certified wilderness guides, and traditional artisans.
            </p>
          </div>

          <button
            onClick={() => onViewAllMarketplace()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2d5a43] hover:text-[#1b4332] group"
          >
            <span>Explore All Listings</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Category Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-stone-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#2d5a43] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredBusinesses.slice(0, 6).map((biz) => {
            const isSaved = isBusinessSaved(biz.id);
            return (
              <div
                key={biz.id}
                onClick={() => onSelectBusiness(biz)}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                  <img
                    src={biz.images[0]}
                    alt={biz.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Save toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveBusiness(biz.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center transition-colors shadow-xs"
                    title={isSaved ? 'Remove from saved' : 'Save business'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-red-500 text-red-500' : 'text-stone-700'
                      }`}
                    />
                  </button>

                  {/* Verified host badge */}
                  {biz.verified && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-lg text-[11px] font-semibold text-[#1b4332] shadow-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2d5a43]" />
                      <span>Verified Local</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#52b788]" />
                    <span>{biz.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                      <span className="capitalize">{biz.category.replace('_', ' ')}</span>
                      <div className="flex items-center gap-1 font-semibold text-stone-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="tabular-nums">{biz.rating.toFixed(1)}</span>
                        <span className="text-stone-400 font-normal">({biz.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-[#2d5a43] transition-colors leading-snug">
                      {biz.name}
                    </h3>

                    <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {biz.shortDescription}
                    </p>

                    <div className="mt-3 text-[11px] text-stone-500 flex items-center gap-2">
                      <span className="text-stone-400">Host:</span>
                      <span className="font-medium text-stone-700">{biz.ownerName}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-stone-400">Rate / Price</div>
                      <div className="text-sm font-bold text-stone-900 font-sans">
                        ₹{biz.price.toLocaleString('en-IN')}{' '}
                        <span className="text-[11px] font-normal text-stone-500">/{biz.priceUnit.split('/')[0]}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookBusiness(biz);
                      }}
                      className="px-4 py-2 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                    >
                      Book Request
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
