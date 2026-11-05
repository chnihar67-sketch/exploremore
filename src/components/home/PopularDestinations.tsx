import React from 'react';
import { Destination } from '../../types';
import { Star, MapPin, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PopularDestinationsProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onViewAll: () => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  destinations,
  onSelectDestination,
  onViewAll,
}) => {
  const { isDestinationSaved, toggleSaveDestination } = useAuth();
  // Signature destinations across Karnataka (Hampi, Coorg, Gokarna, Jog Falls)
  const popularList = [...destinations]
    .filter((d) => !d.isFeaturedHiddenGem)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <section className="py-20 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold text-[#2d5a43] tracking-widest uppercase mb-2">
              Signature Wonders &middot; Karnataka
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Popular Destinations Across Karnataka
            </h2>
            <p className="mt-2 text-stone-600 text-sm max-w-xl">
              From UNESCO monolithic boulder ruins in Hampi to thunderous 830-foot waterfalls, cliffside beaches, and highland coffee estates.
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2d5a43] hover:text-[#1b4332] group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularList.map((dest) => {
            const isSaved = isDestinationSaved(dest.id);
            return (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-stone-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Container with zero-broken-image fallback */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Save button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveDestination(dest.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center transition-colors shadow-xs"
                    title={isSaved ? 'Remove from saved' : 'Save destination'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-red-500 text-red-500' : 'text-stone-700'
                      }`}
                    />
                  </button>

                  {/* District & Taluk metadata unboxed */}
                  <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-[#52b788]" />
                    <span>
                      {dest.taluk}, {dest.district}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                      <span className="capitalize">{dest.category.replace('_', ' ')}</span>
                      <div className="flex items-center gap-1 font-semibold text-stone-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="tabular-nums">{dest.rating.toFixed(1)}</span>
                        <span className="text-stone-400 font-normal">({dest.reviewCount})</span>
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-[#2d5a43] transition-colors leading-snug">
                      {dest.name}
                    </h3>
                    <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {dest.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Estimated budget:</span>
                    <span className="font-semibold text-stone-800 font-sans">{dest.estimatedBudget}</span>
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
