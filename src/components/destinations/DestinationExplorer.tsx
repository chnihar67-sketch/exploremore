import React, { useState, useMemo } from 'react';
import { Destination, DestinationCategory, Business } from '../../types';
import { Search, MapPin, Star, Filter, LayoutGrid, List, Heart, ArrowUpDown, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DestinationDetailModal } from './DestinationDetailModal';

interface DestinationExplorerProps {
  destinations: Destination[];
  businesses: Business[];
  onBookBusiness: (biz: Business) => void;
  onSelectBusiness: (biz: Business) => void;
  initialQuery?: string;
  initialTaluk?: string;
  initialCategory?: string;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  destinations,
  businesses,
  onBookBusiness,
  onSelectBusiness,
  initialQuery = '',
  initialTaluk = 'All Regions',
  initialCategory = 'All',
}) => {
  const { isDestinationSaved, toggleSaveDestination } = useAuth();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTaluk, setSelectedTaluk] = useState(initialTaluk);
  const [selectedType, setSelectedType] = useState<string>(initialCategory === 'All Experiences' ? 'All' : initialCategory);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const regions = [
    'All Regions',
    'Shivamogga (Malnad & Jog Falls)',
    'Vijayanagara (Hampi UNESCO)',
    'Uttara Kannada (Gokarna Coast)',
    'Kodagu (Coorg Coffee Hills)',
    'Bagalkote (Badami Caves)',
  ];
  const categories = [
    { id: 'All', label: 'All Categories' },
    { id: 'waterfall', label: 'Waterfalls' },
    { id: 'hill_station', label: 'Hills & Peaks' },
    { id: 'heritage_fort', label: 'Heritage & Forts' },
    { id: 'rainforest', label: 'Rainforests' },
    { id: 'wildlife', label: 'Coastal & Wildlife' },
  ];

  // Filtering & Sorting
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        const matchesQuery =
          dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.taluk.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.district.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRegion =
          selectedTaluk === 'All Regions' ||
          dest.district.toLowerCase().includes(selectedTaluk.split(' ')[0].toLowerCase()) ||
          dest.taluk.toLowerCase().includes(selectedTaluk.split(' ')[0].toLowerCase()) ||
          selectedTaluk.toLowerCase().includes(dest.district.toLowerCase());

        const matchesType =
          selectedType === 'All' || dest.category === selectedType;

        return matchesQuery && matchesRegion && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        return a.name.localeCompare(b.name);
      });
  }, [destinations, searchQuery, selectedTaluk, selectedType, sortBy]);

  return (
    <div className="py-12 bg-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="text-xs font-semibold text-[#2d5a43] tracking-widest uppercase mb-1.5">
            Karnataka State &middot; Heritage &amp; Nature Corridors
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Destination Explorer
          </h1>
          <p className="mt-2 text-stone-600 text-sm max-w-2xl">
            Discover UNESCO world heritage boulder ruins, roaring 830-foot waterfalls, secluded rainforest sanctuaries, cliffside beaches, and red sandstone cave temples.
          </p>
        </div>

        {/* Filter & Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 flex items-center gap-2.5 px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by name, district, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none placeholder:text-stone-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Region / District Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedTaluk}
                onChange={(e) => setSelectedTaluk(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r === 'All Regions' ? 'All Districts / Regions' : r}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium">
                <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="rating">Sort: Highest Rated</option>
                  <option value="reviews">Sort: Most Popular</option>
                  <option value="name">Sort: Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Grid/List View Toggle */}
            <div className="md:col-span-1 flex items-center justify-end gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#2d5a43] text-white'
                    : 'text-stone-500 hover:bg-stone-100'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#2d5a43] text-white'
                    : 'text-stone-500 hover:bg-stone-100'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedType(c.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedType === c.id
                    ? 'bg-[#2d5a43] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-500">
          <div>
            Showing <span className="font-semibold text-stone-800">{filteredDestinations.length}</span> destinations
          </div>
          {(searchQuery || selectedTaluk !== 'All Regions' || selectedType !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTaluk('All Regions');
                setSelectedType('All');
              }}
              className="text-[#2d5a43] hover:underline font-semibold"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
            <Compass className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-stone-800">No matching destinations found</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
              Try adjusting your search terms or clearing the selected taluk and category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTaluk('All Regions');
                setSelectedType('All');
              }}
              className="px-4 py-2 bg-[#2d5a43] text-white text-xs font-semibold rounded-lg hover:bg-[#1b4332]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Destinations View: Grid or List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredDestinations.map((dest) => {
              const isSaved = isDestinationSaved(dest.id);
              return (
                <div
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest)}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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

                    {dest.isFeaturedHiddenGem && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#14281f]/90 text-[#52b788] text-[11px] font-semibold rounded-lg shadow-sm">
                        Hidden Gem
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-[#52b788]" />
                      <span>{dest.taluk} Taluk</span>
                    </div>
                  </div>

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

                      <div className="mt-3 flex flex-wrap gap-1">
                        {dest.activities.slice(0, 3).map((act, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-stone-100 rounded text-[10px] text-stone-600 font-medium"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-stone-400">Budget Estimate</div>
                        <div className="text-xs font-bold text-stone-900 font-sans">{dest.estimatedBudget}</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDestination(dest);
                        }}
                        className="px-3.5 py-1.5 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDestinations.map((dest) => {
              const isSaved = isDestinationSaved(dest.id);
              return (
                <div
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest)}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-md transition-all p-4 flex flex-col sm:flex-row gap-5 cursor-pointer"
                >
                  <div className="relative sm:w-60 h-44 shrink-0 rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                    />
                    {dest.isFeaturedHiddenGem && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#14281f]/90 text-[#52b788] text-[10px] font-semibold rounded">
                        Hidden Gem
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <span className="capitalize">{dest.category.replace('_', ' ')}</span>
                          <span>&middot;</span>
                          <span className="flex items-center gap-1 font-semibold text-stone-800">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {dest.rating.toFixed(1)} ({dest.reviewCount})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveDestination(dest.id);
                          }}
                          className="text-stone-400 hover:text-red-500 p-1"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isSaved ? 'fill-red-500 text-red-500' : 'text-stone-400'
                            }`}
                          />
                        </button>
                      </div>

                      <h3 className="font-serif font-bold text-xl text-stone-900 mt-1">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-[#2d5a43] mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{dest.taluk} Taluk, {dest.district}</span>
                      </div>
                      <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div className="text-xs text-stone-700">
                        Budget: <span className="font-semibold text-stone-900">{dest.estimatedBudget}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDestination(dest);
                        }}
                        className="px-4 py-2 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold"
                      >
                        Explore Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Destination Detail Modal */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        businesses={businesses}
        onBookBusiness={onBookBusiness}
        onSelectBusiness={onSelectBusiness}
      />
    </div>
  );
};
