import React, { useState, useMemo } from 'react';
import { Destination, Business } from '../../types';
import { MapPin, Navigation, Compass, Star, Eye, CheckCircle, Search, Layers, X, ArrowRight } from 'lucide-react';

interface InteractiveTourismMapProps {
  destinations: Destination[];
  businesses: Business[];
  onSelectDestination: (dest: Destination) => void;
  onBookBusiness: (biz: Business) => void;
}

type MapPinType =
  | { kind: 'destination'; data: Destination }
  | { kind: 'business'; data: Business };

export const InteractiveTourismMap: React.FC<InteractiveTourismMapProps> = ({
  destinations,
  businesses,
  onSelectDestination,
  onBookBusiness,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState<MapPinType | null>(null);

  // Karnataka statewide bounding box calibration for map projection
  // Lat: ~11.8 (Coorg / South) to 16.5 N (Badami / North)
  // Lng: ~73.8 (Karavali Coast) to 77.2 E (Hampi / East)
  const MIN_LAT = 11.8;
  const MAX_LAT = 16.5;
  const MIN_LNG = 73.8;
  const MAX_LNG = 77.2;

  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Convert lat/lng to percentage within map viewBox
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
    // Invert y since latitude increases northward (up)
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 100;
    return {
      x: Math.max(7, Math.min(93, x)),
      y: Math.max(9, Math.min(91, y)),
    };
  };

  // Combine markers
  const allPins: MapPinType[] = useMemo(() => {
    const dPins: MapPinType[] = destinations.map((d) => ({
      kind: 'destination',
      data: d,
    }));
    const bPins: MapPinType[] = businesses.map((b) => ({
      kind: 'business',
      data: b,
    }));
    return [...dPins, ...bPins];
  }, [destinations, businesses]);

  // Filter markers by category, region, and search query
  const filteredPins = useMemo(() => {
    return allPins.filter((pin) => {
      const name = pin.data.name.toLowerCase();
      const queryMatch = !searchQuery || name.includes(searchQuery.toLowerCase());
      if (!queryMatch) return false;

      // Region match
      if (selectedRegion !== 'all') {
        const district = pin.kind === 'destination' ? pin.data.district : pin.data.location;
        const taluk = pin.kind === 'destination' ? pin.data.taluk : '';
        const text = `${district} ${taluk}`.toLowerCase();

        if (selectedRegion === 'malnad' && !text.includes('shivamogga') && !text.includes('sagar') && !text.includes('tirthahalli') && !text.includes('agumbe') && !text.includes('hosanagara')) {
          return false;
        }
        if (selectedRegion === 'heritage' && !text.includes('vijayanagara') && !text.includes('hampi') && !text.includes('bagalkote') && !text.includes('badami')) {
          return false;
        }
        if (selectedRegion === 'karavali' && !text.includes('uttara kannada') && !text.includes('gokarna') && !text.includes('kumta') && !text.includes('karwar')) {
          return false;
        }
        if (selectedRegion === 'coorg' && !text.includes('kodagu') && !text.includes('coorg') && !text.includes('madikeri')) {
          return false;
        }
      }

      // Category match
      if (activeCategory === 'all') return true;
      if (activeCategory === 'destinations') return pin.kind === 'destination';
      if (activeCategory === 'homestays') return pin.kind === 'business' && pin.data.category === 'homestay';
      if (activeCategory === 'guides') return pin.kind === 'business' && pin.data.category === 'tour_guide';
      if (activeCategory === 'food') return pin.kind === 'business' && pin.data.category === 'restaurant';
      if (activeCategory === 'adventure') return pin.kind === 'business' && pin.data.category === 'adventure';
      if (activeCategory === 'cultural') return pin.kind === 'business' && (pin.data.category === 'cultural' || pin.data.category === 'handicraft');

      return true;
    });
  }, [allPins, activeCategory, selectedRegion, searchQuery]);

  const getPinColor = (pin: MapPinType) => {
    if (pin.kind === 'destination') {
      return pin.data.isFeaturedHiddenGem ? '#1b4332' : '#2d6a4f';
    }
    switch (pin.data.category) {
      case 'homestay':
        return '#c8873a';
      case 'tour_guide':
        return '#0284c7';
      case 'restaurant':
        return '#d97706';
      case 'adventure':
        return '#dc2626';
      case 'cultural':
      case 'handicraft':
        return '#0f766e';
      default:
        return '#2d5a43';
    }
  };

  return (
    <div className="py-8 bg-[#faf7f2] min-h-[calc(100vh-80px)] flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-[#2d5a43] tracking-widest uppercase mb-1">
              Cartographic Exploration &middot; Karnataka State
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Interactive Tourism Map of Karnataka
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Explore destinations, homestays, and certified guides across Malnad, Karavali, Vijayanagara, and Kodagu.
            </p>
          </div>

          {/* Quick search input */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-stone-200 shadow-xs max-w-xs">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search places or stays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-stone-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Region selector tabs */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto text-xs shrink-0 pb-1">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mr-1">Region:</span>
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedRegion === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Karnataka
          </button>
          <button
            onClick={() => setSelectedRegion('malnad')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedRegion === 'malnad'
                ? 'bg-[#2d5a43] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Western Ghats &amp; Malnad
          </button>
          <button
            onClick={() => setSelectedRegion('karavali')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedRegion === 'karavali'
                ? 'bg-[#0284c7] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Karavali Coast &middot; Gokarna
          </button>
          <button
            onClick={() => setSelectedRegion('heritage')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedRegion === 'heritage'
                ? 'bg-[#c8873a] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Northern Heritage &middot; Hampi &amp; Badami
          </button>
          <button
            onClick={() => setSelectedRegion('coorg')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedRegion === 'coorg'
                ? 'bg-[#0f766e] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Kodagu &middot; Coorg Hills
          </button>
        </div>

        {/* Filter categories strip */}
        <div className="flex items-center gap-2 pb-4 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mr-1">Category:</span>
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#2d5a43] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Services ({filteredPins.length})
          </button>
          <button
            onClick={() => setActiveCategory('destinations')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'destinations'
                ? 'bg-[#2d5a43] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Destinations &amp; Hidden Gems
          </button>
          <button
            onClick={() => setActiveCategory('homestays')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'homestays'
                ? 'bg-[#c8873a] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Plantation Homestays
          </button>
          <button
            onClick={() => setActiveCategory('guides')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'guides'
                ? 'bg-[#0284c7] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Local Guides
          </button>
          <button
            onClick={() => setActiveCategory('food')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'food'
                ? 'bg-[#d97706] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Traditional Food
          </button>
          <button
            onClick={() => setActiveCategory('adventure')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'adventure'
                ? 'bg-[#dc2626] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Adventure &amp; 4x4
          </button>
          <button
            onClick={() => setActiveCategory('cultural')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'cultural'
                ? 'bg-[#0f766e] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Heritage &amp; Crafts
          </button>
        </div>

        {/* Map Viewport Area */}
        <div className="relative flex-1 min-h-[520px] lg:min-h-[580px] bg-[#e6ede7] rounded-3xl border border-stone-300 overflow-hidden shadow-inner flex flex-col justify-between">
          {/* Topographic Karnataka Stylized Map Canvas */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="karnatakaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dce8de" />
                <stop offset="50%" stopColor="#c8dccb" />
                <stop offset="100%" stopColor="#bed5c2" />
              </linearGradient>
            </defs>

            {/* Background terrain */}
            <rect width="100" height="100" fill="url(#karnatakaGradient)" />

            {/* Arabian Sea Coastline strip on the West */}
            <path
              d="M 0 0 L 8 0 Q 12 35 10 50 Q 7 75 12 100 L 0 100 Z"
              fill="#bfe1ea"
              opacity="0.45"
            />
            <path
              d="M 8 0 Q 12 35 10 50 Q 7 75 12 100"
              fill="none"
              stroke="#7baecc"
              strokeWidth="0.8"
            />

            {/* Major Karnataka Rivers: Tungabhadra (North-East), Sharavathi & Tunga (Mid-West), Kaveri (South) */}
            <path
              d="M 52 14 Q 65 20 80 23 T 98 25"
              fill="none"
              stroke="#94b8d7"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 12 45 Q 26 48 36 49 T 58 52"
              fill="none"
              stroke="#94b8d7"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M 38 60 Q 50 63 65 67 T 95 72"
              fill="none"
              stroke="#94b8d7"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 50 85 Q 65 87 78 88 T 98 90"
              fill="none"
              stroke="#94b8d7"
              strokeWidth="1.3"
              strokeLinecap="round"
            />

            {/* Western Ghats mountain ridge elevation lines */}
            <path
              d="M 22 20 Q 30 50 32 80"
              fill="none"
              stroke="#2d5a43"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity="0.4"
            />
            <path
              d="M 28 25 Q 36 55 38 85"
              fill="none"
              stroke="#2d5a43"
              strokeWidth="0.4"
              strokeDasharray="2,2"
              opacity="0.3"
            />
          </svg>

          {/* Regional Geographic Overlays */}
          <div className="absolute top-5 right-10 pointer-events-none text-stone-500/75 font-serif font-bold text-xs sm:text-sm tracking-wider">
            NORTH KARNATAKA &middot; BADAMI &amp; HAMPI
          </div>
          <div className="absolute top-2/5 left-14 pointer-events-none text-stone-500/75 font-serif font-bold text-xs sm:text-sm tracking-wider">
            KARAVALI &amp; GOKARNA COAST
          </div>
          <div className="absolute top-1/2 left-32 pointer-events-none text-stone-500/75 font-serif font-bold text-xs sm:text-sm tracking-wider">
            WESTERN GHATS &middot; MALNAD &amp; JOG FALLS
          </div>
          <div className="absolute bottom-8 right-24 pointer-events-none text-stone-500/75 font-serif font-bold text-xs sm:text-sm tracking-wider">
            KODAGU &middot; COORG COFFEE HILLS
          </div>

          {/* Interactive Projected Map Markers */}
          <div className="absolute inset-0">
            {filteredPins.map((pin) => {
              const { x, y } = projectCoords(
                pin.data.coordinates.lat,
                pin.data.coordinates.lng
              );
              const color = getPinColor(pin);
              const isSelected = selectedPin?.data.id === pin.data.id;

              return (
                <button
                  key={pin.data.id}
                  onClick={() => setSelectedPin(pin)}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-10 transition-transform active:scale-90"
                  title={pin.data.name}
                >
                  <div
                    style={{ backgroundColor: color }}
                    className={`relative p-2 rounded-lg text-white shadow-md transition-all duration-200 ${
                      isSelected
                        ? 'ring-4 ring-white scale-125 z-20'
                        : 'group-hover:scale-115'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>

                  {/* Pin label tag */}
                  <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-0.5 bg-stone-900/85 text-white text-[10px] rounded whitespace-nowrap pointer-events-none font-medium shadow-xs">
                    {pin.data.name.split('(')[0].trim()}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Legend Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-200 text-[11px] shadow-sm hidden md:block space-y-1.5">
            <div className="font-semibold text-stone-800 uppercase tracking-wider text-[10px] mb-1">
              Legend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#2d6a4f]" />
              <span>Heritage &amp; Natural Destinations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#c8873a]" />
              <span>Plantation &amp; Coastal Homestays</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0284c7]" />
              <span>Local Naturalists &amp; Guides</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#dc2626]" />
              <span>Adventure &amp; 4x4 Mountain Safari</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#d97706]" />
              <span>Traditional Food Experiences</span>
            </div>
          </div>

          {/* Selected Pin Bottom Flyout Card */}
          {selectedPin && (
            <div className="relative z-30 p-4 m-4 bg-white/98 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl max-w-lg self-center sm:self-start animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={
                      selectedPin.kind === 'destination'
                        ? selectedPin.data.image
                        : selectedPin.data.images[0]
                    }
                    alt={selectedPin.data.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <div className="text-[10px] font-semibold text-[#2d5a43] uppercase tracking-wider">
                      {selectedPin.kind === 'destination'
                        ? `${selectedPin.data.taluk} Taluk`
                        : selectedPin.data.category.replace('_', ' ')}
                    </div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 line-clamp-1">
                      {selectedPin.data.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
                      <div className="flex items-center gap-1 font-semibold text-stone-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{selectedPin.data.rating.toFixed(1)}</span>
                      </div>
                      <span>&middot;</span>
                      <span className="line-clamp-1">
                        {selectedPin.kind === 'destination'
                          ? selectedPin.data.estimatedBudget
                          : `₹${selectedPin.data.price} ${selectedPin.data.priceUnit}`}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPin(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                {selectedPin.kind === 'destination' ? (
                  <button
                    onClick={() => onSelectDestination(selectedPin.data)}
                    className="px-4 py-1.5 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <span>View Destination Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onBookBusiness(selectedPin.data)}
                    className="px-4 py-1.5 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Request Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
