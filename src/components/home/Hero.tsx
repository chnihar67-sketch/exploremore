import React, { useState } from 'react';
import { Search, MapPin, Compass, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string, taluk: string, category: string) => void;
  onOpenAI: () => void;
  onExploreNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onOpenAI, onExploreNow }) => {
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Regions');
  const [selectedCategory, setSelectedCategory] = useState('All Experiences');

  const locations = [
    'All Regions',
    'Western Ghats & Malnad',
    'Karavali Coast & Gokarna',
    'Heritage North & Hampi',
    'Coorg & Southern Hills',
    'Sagar & Jog Falls',
    'Tirthahalli & Agumbe',
  ];

  const categories = [
    'All Experiences',
    'Heritage Homestays',
    'Certified Tour Guides',
    'Hidden Waterfalls & Treks',
    'Traditional Coastal & Malnad Cuisine',
    'Artisanal Handicrafts',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, selectedLocation, selectedCategory);
  };

  return (
    <div className="relative min-h-[560px] lg:min-h-[620px] flex items-center justify-center bg-[#14281f] overflow-hidden">
      {/* Background Photography with measured contrast scrim */}
      <img
        src="/src/assets/images/hero_western_ghats_1793847865500.jpg"
        alt="Western Ghats Karnataka misty rainforest canopy"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#14281f] via-[#14281f]/65 to-[#14281f]/45" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Editorial kicker - rectangular rounded-md tag, no pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-xs rounded-md border border-white/20 text-xs text-stone-200 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-[#52b788]" />
          <span>Verified Local Tourism Portal &middot; Karnataka, India</span>
        </div>

        {/* Clear, Grounded Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-5 drop-shadow-sm">
          Local Homestays, Certified Guides &amp; Heritage Trails Across Karnataka
        </h1>

        {/* Concrete Subheading */}
        <p className="text-sm sm:text-base lg:text-lg text-stone-200/90 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
          Book directly with verified plantation homestays, licensed nature and heritage guides, and traditional family kitchens from the Western Ghats to the Karavali coast.
        </p>

        {/* Search & Selector Island */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-3 sm:p-4 shadow-xl border border-stone-200 text-stone-900">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search query input */}
            <div className="lg:col-span-4 flex items-center gap-2 px-3 py-2.5 bg-stone-50 rounded-lg border border-stone-200">
              <Search className="w-4 h-4 text-[#2d5a43] shrink-0" />
              <input
                type="text"
                placeholder="Search waterfall, fort, stay..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none placeholder:text-stone-400 font-medium"
              />
            </div>

            {/* Location selector */}
            <div className="lg:col-span-3 flex items-center gap-2 px-3 py-2.5 bg-stone-50 rounded-lg border border-stone-200">
              <MapPin className="w-4 h-4 text-[#2d5a43] shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none font-medium cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="text-stone-900">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience category selector */}
            <div className="lg:col-span-3 flex items-center gap-2 px-3 py-2.5 bg-stone-50 rounded-lg border border-stone-200">
              <Compass className="w-4 h-4 text-[#2d5a43] shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none font-medium cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-stone-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Action button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                Search Listings
              </button>
            </div>
          </form>
        </div>

        {/* Regional Quick Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-300">
          <span className="text-stone-400">Popular destinations:</span>
          <button
            onClick={() => onSearch('Hampi', 'All Regions', 'All Experiences')}
            className="hover:text-white underline decoration-stone-500 underline-offset-4"
          >
            Hampi UNESCO
          </button>
          <span>&middot;</span>
          <button
            onClick={() => onSearch('Jog Falls', 'All Regions', 'All Experiences')}
            className="hover:text-white underline decoration-stone-500 underline-offset-4"
          >
            Jog Falls
          </button>
          <span>&middot;</span>
          <button
            onClick={() => onSearch('Gokarna', 'All Regions', 'All Experiences')}
            className="hover:text-white underline decoration-stone-500 underline-offset-4"
          >
            Gokarna Coast
          </button>
          <span>&middot;</span>
          <button
            onClick={() => onSearch('Coorg', 'All Regions', 'All Experiences')}
            className="hover:text-white underline decoration-stone-500 underline-offset-4"
          >
            Coorg Hills
          </button>
          <span>&middot;</span>
          <button
            onClick={() => onSearch('Badami', 'All Regions', 'All Experiences')}
            className="hover:text-white underline decoration-stone-500 underline-offset-4"
          >
            Badami Caves
          </button>
          <span>&middot;</span>
          <button
            onClick={onOpenAI}
            className="text-[#52b788] hover:text-[#74c69d] font-semibold"
          >
            Trip Assistant &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
