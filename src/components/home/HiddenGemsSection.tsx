import React, { useState } from 'react';
import { Destination } from '../../types';
import { Sparkles, MapPin, Compass, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HiddenGemsProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onExploreMoreGems: () => void;
}

export const HiddenGemsSection: React.FC<HiddenGemsProps> = ({
  destinations,
  onSelectDestination,
  onExploreMoreGems,
}) => {
  const { isDestinationSaved, toggleSaveDestination } = useAuth();
  const [filterType, setFilterType] = useState<'all' | 'heritage_fort' | 'waterfall' | 'hill_station' | 'wildlife'>('all');

  const hiddenGems = destinations.filter((d) => d.isFeaturedHiddenGem);
  const filteredGems = filterType === 'all'
    ? hiddenGems
    : hiddenGems.filter((d) => d.category === filterType);

  return (
    <section className="py-24 bg-[#14281f] text-stone-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-md text-xs font-semibold text-[#52b788] mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unexplored Corridors</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Beyond the Tourist Map
          </h2>
          <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed">
            Step away from crowded lookouts into ancient Keladi hill fortresses, sacred monoliths shrouded in morning mist, untamed canyon falls, and silent backwater sanctuaries.
          </p>
        </div>

        {/* Filter buttons - functional interactive tab controls */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-white/10">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-[#52b788] text-[#14281f] shadow-sm'
                : 'bg-white/10 text-stone-300 hover:bg-white/15'
            }`}
          >
            All Hidden Gems ({hiddenGems.length})
          </button>
          <button
            onClick={() => setFilterType('heritage_fort')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'heritage_fort'
                ? 'bg-[#52b788] text-[#14281f] shadow-sm'
                : 'bg-white/10 text-stone-300 hover:bg-white/15'
            }`}
          >
            Ancient Forts
          </button>
          <button
            onClick={() => setFilterType('hill_station')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'hill_station'
                ? 'bg-[#52b788] text-[#14281f] shadow-sm'
                : 'bg-white/10 text-stone-300 hover:bg-white/15'
            }`}
          >
            Silent Monoliths
          </button>
          <button
            onClick={() => setFilterType('waterfall')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'waterfall'
                ? 'bg-[#52b788] text-[#14281f] shadow-sm'
                : 'bg-white/10 text-stone-300 hover:bg-white/15'
            }`}
          >
            Canyon Cascades
          </button>
          <button
            onClick={() => setFilterType('wildlife')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'wildlife'
                ? 'bg-[#52b788] text-[#14281f] shadow-sm'
                : 'bg-white/10 text-stone-300 hover:bg-white/15'
            }`}
          >
            Island Backwaters
          </button>
        </div>

        {/* Highlighted Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filteredGems.map((gem) => {
            const isSaved = isDestinationSaved(gem.id);
            return (
              <div
                key={gem.id}
                onClick={() => onSelectDestination(gem)}
                className="group bg-[#1c382b] rounded-2xl overflow-hidden border border-[#2d5a43] hover:border-[#52b788]/60 transition-all duration-300 flex flex-col sm:flex-row cursor-pointer"
              >
                {/* Image side */}
                <div className="relative sm:w-1/2 aspect-4/3 sm:aspect-auto overflow-hidden bg-stone-900 shrink-0">
                  <img
                    src={gem.image}
                    alt={gem.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 sm:from-transparent to-transparent" />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveDestination(gem.id);
                    }}
                    className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow-sm"
                    title={isSaved ? 'Remove from saved' : 'Save gem'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Info side */}
                <div className="p-6 sm:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#52b788] mb-2 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{gem.taluk} Taluk &middot; {gem.travelInfo.trekDifficulty || 'Moderate'} Trek</span>
                    </div>

                    <h3 className="font-serif font-bold text-xl text-white group-hover:text-[#52b788] transition-colors leading-snug">
                      {gem.name}
                    </h3>

                    <p className="mt-2.5 text-xs text-stone-300 leading-relaxed line-clamp-3">
                      {gem.description}
                    </p>

                    <div className="mt-3 space-y-1">
                      {gem.highlights.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="text-[11px] text-stone-400 flex items-start gap-1.5">
                          <span className="text-[#52b788]">&bull;</span>
                          <span className="line-clamp-1">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-stone-400">Best Season:</span>
                    <span className="text-stone-200 font-medium">{gem.bestTimeToVisit.split('(')[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-6 bg-gradient-to-r from-[#1c382b] to-[#234835] rounded-2xl border border-[#2d5a43] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#52b788]/20 flex items-center justify-center text-[#52b788] shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-serif font-bold text-white">Know an Unexplored Western Ghats Location?</div>
              <div className="text-xs text-stone-300">
                Local hosts and naturalists can propose verified hidden gems directly for district review.
              </div>
            </div>
          </div>
          <button
            onClick={onExploreMoreGems}
            className="px-5 py-2.5 text-xs font-semibold text-[#14281f] bg-[#52b788] hover:bg-[#74c69d] rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
          >
            <span>Explore All Beyond The Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
