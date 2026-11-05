import React, { useState, useMemo } from 'react';
import { Business, BusinessCategory } from '../../types';
import { Search, MapPin, Star, Filter, CheckCircle, ArrowUpDown, Plus, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BusinessDetailModal } from './BusinessDetailModal';

interface MarketplaceExplorerProps {
  businesses: Business[];
  onBookBusiness: (biz: Business) => void;
  onOpenNewListingModal: () => void;
  initialCategory?: BusinessCategory | 'all';
}

export const MarketplaceExplorer: React.FC<MarketplaceExplorerProps> = ({
  businesses,
  onBookBusiness,
  onOpenNewListingModal,
  initialCategory = 'all',
}) => {
  const { role, isBusinessSaved, toggleSaveBusiness } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedTaluk, setSelectedTaluk] = useState('All Regions');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'homestay', label: 'Homestays' },
    { id: 'tour_guide', label: 'Tour Guides' },
    { id: 'adventure', label: 'Adventure & 4x4' },
    { id: 'restaurant', label: 'Traditional Food' },
    { id: 'cultural', label: 'Cultural Walks' },
    { id: 'handicraft', label: 'Local Handicrafts' },
  ];

  const regions = [
    'All Regions',
    'Western Ghats & Malnad',
    'Vijayanagara (Hampi)',
    'Karavali Coast (Gokarna)',
    'Kodagu (Coorg Hills)',
    'Bagalkote (Badami)',
    'Shivamogga',
  ];

  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((biz) => {
        // Show verified to tourists by default, or all if admin/owner
        const isVerifiedOrOwner = biz.verified || role === 'admin' || role === 'business_owner';
        if (!isVerifiedOrOwner) return false;

        const matchesQuery =
          biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          biz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          biz.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          biz.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === 'all' || biz.category === selectedCategory;

        const matchesRegion =
          selectedTaluk === 'All Regions' ||
          biz.location.toLowerCase().includes(selectedTaluk.split(' ')[0].toLowerCase()) ||
          selectedTaluk.toLowerCase().includes(biz.location.toLowerCase());

        return matchesQuery && matchesCategory && matchesRegion;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0;
      });
  }, [businesses, searchQuery, selectedCategory, selectedTaluk, sortBy, role]);

  return (
    <div className="py-12 bg-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold text-[#2d5a43] tracking-widest uppercase mb-1.5">
              Support Grassroots Tourism &middot; Karnataka
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
              Local Business Marketplace
            </h1>
            <p className="mt-2 text-stone-600 text-sm max-w-2xl">
              Book direct stays in heritage areca and coffee plantations, hire certified naturalists and archaeological guides, taste authentic coastal and Malnad meals, and purchase handcrafted local goods.
            </p>
          </div>

          {/* Business owner create listing button */}
          {(role === 'business_owner' || role === 'admin') && (
            <button
              onClick={onOpenNewListingModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2d5a43] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-xl transition-all shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>List Your Business</span>
            </button>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <div className="md:col-span-5 flex items-center gap-2.5 px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="Search homestay, guide, food, host name..."
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

            {/* Region Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedTaluk}
                onChange={(e) => setSelectedTaluk(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
              >
                {regions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="md:col-span-4 flex items-center gap-2 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium">
              <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="rating">Sort: Highest Rated</option>
                <option value="price_asc">Sort: Price (Low to High)</option>
                <option value="price_desc">Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Categories Tab Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#2d5a43] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-500">
          <div>
            Showing <span className="font-semibold text-stone-800">{filteredBusinesses.length}</span> verified local services
          </div>
          {(searchQuery || selectedTaluk !== 'All Regions' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTaluk('All Regions');
                setSelectedCategory('all');
              }}
              className="text-[#2d5a43] hover:underline font-semibold"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredBusinesses.map((biz) => {
            const isSaved = isBusinessSaved(biz.id);
            return (
              <div
                key={biz.id}
                onClick={() => setSelectedBusiness(biz)}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              >
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
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-red-500 text-red-500' : 'text-stone-700'
                      }`}
                    />
                  </button>

                  {biz.verified ? (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-lg text-[11px] font-semibold text-[#1b4332] shadow-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2d5a43]" />
                      <span>Verified Local</span>
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-semibold rounded">
                      Pending Audit
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#52b788]" />
                    <span>{biz.location}</span>
                  </div>
                </div>

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

                    <div className="mt-3 text-[11px] text-stone-500">
                      Host: <span className="text-stone-700 font-medium">{biz.ownerName}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400">Rate / Price</div>
                      <div className="text-sm font-bold text-stone-900 font-sans">
                        ₹{biz.price.toLocaleString('en-IN')}{' '}
                        <span className="text-[11px] font-normal text-stone-500">/{biz.priceUnit.split('/')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBusiness(biz);
                        }}
                        className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 rounded-lg text-xs font-medium text-stone-700 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookBusiness(biz);
                        }}
                        className="px-3.5 py-1.5 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Details Modal */}
      <BusinessDetailModal
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        onBook={onBookBusiness}
      />
    </div>
  );
};
