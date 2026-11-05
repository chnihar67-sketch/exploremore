import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { saveUserItinerary } from '../../services/storage';
import { Sparkles, MapPin, Calendar, Users, Wallet, Check, Bookmark, Clock, ArrowRight, Loader2, Navigation, Utensils } from 'lucide-react';
import { SavedItinerary } from '../../types';

interface ItineraryGeneratorProps {
  onExploreDestinations: () => void;
  onExploreMarketplace: () => void;
}

export const ItineraryGenerator: React.FC<ItineraryGeneratorProps> = ({
  onExploreDestinations,
  onExploreMarketplace,
}) => {
  const { user } = useAuth();

  // Form states
  const [startingLocation, setStartingLocation] = useState('Bengaluru');
  const [region, setRegion] = useState('Entire Karnataka Highlights');
  const [budget, setBudget] = useState(6000);
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Nature & Waterfalls',
    'UNESCO World Heritage',
    'Local Regional Cuisine',
  ]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'Traditional Homestay',
    'Guided Heritage & Nature Hike',
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<SavedItinerary | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const interestOptions = [
    'Nature & Waterfalls',
    'UNESCO World Heritage',
    'Rainforest & Wildlife',
    'Coastal Cliffs & Beaches',
    'Local Regional Cuisine',
    'Ancient Rock-Cut Caves',
    'Highland Coffee Plantations',
    'Off-Road 4x4 Mountain Treks',
    'Artisanal Handicrafts',
  ];

  const activityOptions = [
    'Traditional Homestay',
    'Guided Heritage & Nature Hike',
    'Sunset Cliff & Cloud Watching',
    'River Coracle & Kayak Rides',
    'Coffee Plantation Cupping Tour',
    'Elephant Camp Interaction',
    'Wood Carving & Craft Workshop',
  ];

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleActivity = (item: string) => {
    setSelectedActivities((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsSaved(false);

    try {
      const response = await fetch('/api/gemini/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startingLocation,
          destination: region,
          budget,
          days,
          travelers,
          interests: selectedInterests,
          preferredActivities: selectedActivities,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      setGeneratedPlan({
        id: `itin-${Date.now()}`,
        title: data.title || `${days}-Day Shivamogga & Malnad Expedition`,
        overview: data.overview || '',
        totalEstimatedBudget: data.totalEstimatedBudget || `₹${budget}`,
        days: data.days || [],
        budgetBreakdown: data.budgetBreakdown || {
          accommodation: `₹${Math.round(budget * 0.4)}`,
          food: `₹${Math.round(budget * 0.25)}`,
          activitiesAndGuides: `₹${Math.round(budget * 0.2)}`,
          transportAndMisc: `₹${Math.round(budget * 0.15)}`,
        },
        localTips: data.localTips || [],
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(err);
      setError('Could not generate the plan right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItinerary = () => {
    if (!generatedPlan || !user) return;
    saveUserItinerary(user.id, generatedPlan);
    setIsSaved(true);
  };

  return (
    <div className="py-12 bg-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e7efe9] text-[#1b4332] rounded-md text-xs font-semibold mb-3 border border-[#2d5a43]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#2d5a43]" />
            <span>Itinerary Planning Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Craft Your Custom Karnataka Journey
          </h1>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            Tell us your budget, available days, and travel style. Localora AI will build an authentic day-wise journey with verified homestays and regional cuisine across Karnataka.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto mb-12">
          <form onSubmit={handleGenerate} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            {/* Starting & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Starting City / Hub
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <MapPin className="w-4 h-4 text-[#2d5a43]" />
                  <input
                    type="text"
                    required
                    value={startingLocation}
                    onChange={(e) => setStartingLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Mysuru, Hubballi, Shivamogga"
                    className="w-full text-xs sm:text-sm bg-transparent focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Preferred Karnataka Region
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <Navigation className="w-4 h-4 text-[#2d5a43]" />
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="Entire Karnataka Highlights">Entire Karnataka Highlights (Heritage, Ghats &amp; Coast)</option>
                    <option value="Western Ghats & Malnad">Western Ghats &amp; Malnad (Shivamogga, Jog Falls &amp; Agumbe)</option>
                    <option value="Northern Heritage & Hampi">Northern Heritage (Hampi UNESCO, Badami Caves &amp; Aihole)</option>
                    <option value="Karavali Coast & Gokarna">Karavali Coast (Gokarna Om Beach &amp; Cliff Trails)</option>
                    <option value="Kodagu & Southern Hills">Kodagu &amp; Coorg Hills (Coffee Estates &amp; Talacauvery)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Budget, Days, Travelers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Total Budget (₹)
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <Wallet className="w-4 h-4 text-[#2d5a43]" />
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value) || 2000)}
                    className="w-full text-xs sm:text-sm bg-transparent focus:outline-none font-medium"
                  />
                </div>
                <div className="text-[10px] text-stone-400 mt-1">₹{budget.toLocaleString('en-IN')} total pool</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Duration (Days)
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <Calendar className="w-4 h-4 text-[#2d5a43]" />
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    className="w-full text-xs sm:text-sm bg-transparent focus:outline-none font-medium"
                  />
                </div>
                <div className="text-[10px] text-stone-400 mt-1">{days} full day(s) plan</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Number of Travellers
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <Users className="w-4 h-4 text-[#2d5a43]" />
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                    className="w-full text-xs sm:text-sm bg-transparent focus:outline-none font-medium"
                  />
                </div>
                <div className="text-[10px] text-stone-400 mt-1">{travelers} person(s)</div>
              </div>
            </div>

            {/* Travel Interests (Interactive Filter Chips) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Travel Interests (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((item) => {
                  const active = selectedInterests.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        active
                          ? 'bg-[#2d5a43] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Activities */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Preferred Activities
              </label>
              <div className="flex flex-wrap gap-2">
                {activityOptions.map((item) => {
                  const active = selectedActivities.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleActivity(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        active
                          ? 'bg-[#1b4332] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Regional Route &amp; Budget...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Intelligent Itinerary</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Section */}
        {generatedPlan && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Itinerary Banner Card */}
            <div className="bg-[#14281f] text-white rounded-2xl p-6 sm:p-8 border border-[#2d5a43] shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="text-xs text-[#52b788] font-semibold uppercase tracking-wider mb-1">
                    Custom Route Proposal
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {generatedPlan.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                    {generatedPlan.overview}
                  </p>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="text-right">
                    <div className="text-[11px] text-stone-400">Total Est. Budget</div>
                    <div className="text-xl font-serif font-bold text-[#52b788]">
                      {generatedPlan.totalEstimatedBudget}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveItinerary}
                    disabled={isSaved}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
                      isSaved
                        ? 'bg-[#52b788] text-[#14281f]'
                        : 'bg-white text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved in Dashboard</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save Itinerary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Budget Breakdown Strip */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-stone-400 text-[11px]">Accommodation</div>
                  <div className="font-semibold text-white mt-0.5">
                    {generatedPlan.budgetBreakdown.accommodation}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-stone-400 text-[11px]">Food &amp; Meals</div>
                  <div className="font-semibold text-white mt-0.5">
                    {generatedPlan.budgetBreakdown.food}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-stone-400 text-[11px]">Guides &amp; Permits</div>
                  <div className="font-semibold text-white mt-0.5">
                    {generatedPlan.budgetBreakdown.activitiesAndGuides}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-stone-400 text-[11px]">Transport &amp; Misc</div>
                  <div className="font-semibold text-white mt-0.5">
                    {generatedPlan.budgetBreakdown.transportAndMisc}
                  </div>
                </div>
              </div>
            </div>

            {/* Day by Day Plan */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Day-by-Day Journey Breakdown
              </h3>

              {generatedPlan.days.map((d) => (
                <div
                  key={d.dayNumber}
                  className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2d5a43] text-white flex items-center justify-center font-bold text-xs">
                        {d.dayNumber}
                      </div>
                      <h4 className="font-serif font-bold text-base text-stone-900">
                        {d.title}
                      </h4>
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                      Est. Spend: <strong className="text-stone-800">{d.estimatedCost}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                      <div className="font-semibold text-[#2d5a43] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Morning</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">{d.morning}</p>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                      <div className="font-semibold text-amber-700 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Afternoon</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">{d.afternoon}</p>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                      <div className="font-semibold text-[#14281f] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Evening</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">{d.evening}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-stone-400 text-[11px]">Places on this route:</span>
                    {d.destinations.map((place, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2.5 py-0.5 bg-[#eef5f0] text-[#1b4332] rounded text-[11px] font-semibold"
                      >
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Local Tips & Booking CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 space-y-3">
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  Regional Ground Rules &amp; Tips
                </h4>
                <ul className="space-y-2 text-xs text-stone-600">
                  {generatedPlan.localTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#2d5a43] font-bold">&bull;</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#eef5f0] to-[#e1eee4] p-6 rounded-2xl border border-[#2d5a43]/20 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1b4332] mb-1">
                    Ready to Book This Plan?
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Check verified availability for the homestays, trekking guides, and Malnad meal experiences featured in your route.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={onExploreMarketplace}
                    className="px-4 py-2 bg-[#2d5a43] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>Browse Homestays &amp; Guides</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
