import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/home/Hero';
import { PopularDestinations } from './components/home/PopularDestinations';
import { HiddenGemsSection } from './components/home/HiddenGemsSection';
import { MarketplaceShowcase } from './components/home/MarketplaceShowcase';
import { WhyChooseLocalora } from './components/home/WhyChooseLocalora';
import { Testimonials } from './components/home/Testimonials';
import { DestinationExplorer } from './components/destinations/DestinationExplorer';
import { DestinationDetailModal } from './components/destinations/DestinationDetailModal';
import { MarketplaceExplorer } from './components/marketplace/MarketplaceExplorer';
import { InteractiveTourismMap } from './components/map/InteractiveTourismMap';
import { ItineraryGenerator } from './components/itinerary/ItineraryGenerator';
import { TouristDashboard } from './components/dashboards/TouristDashboard';
import { BusinessDashboard } from './components/dashboards/BusinessDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { LocaloraAssistantModal } from './components/assistant/LocaloraAssistantModal';
import { BookingModal } from './components/booking/BookingModal';
import { NewListingModal } from './components/marketplace/NewListingModal';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsConditions } from './components/legal/TermsConditions';
import { CustomDomainModal } from './components/legal/CustomDomainModal';
import {
  getDestinations,
  getBusinesses,
  subscribeToData,
} from './services/storage';
import { Destination, Business, Booking, BusinessCategory } from './types';

function MainApp() {
  const { role } = useAuth();

  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Search parameters for explorer
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTaluk, setSearchTaluk] = useState('All Regions');
  const [searchCategory, setSearchCategory] = useState('All');
  const [marketplaceCategory, setMarketplaceCategory] = useState<BusinessCategory | 'all'>('all');

  // Live Data State
  const [destinations, setDestinations] = useState<Destination[]>(getDestinations());
  const [businesses, setBusinesses] = useState<Business[]>(getBusinesses());

  useEffect(() => {
    const unsubscribe = subscribeToData(() => {
      setDestinations(getDestinations());
      setBusinesses(getBusinesses());
    });
    return unsubscribe;
  }, []);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [selectedDestinationForModal, setSelectedDestinationForModal] = useState<Destination | null>(null);
  const [selectedBusinessForBooking, setSelectedBusinessForBooking] = useState<Business | null>(null);
  const [newListingModalOpen, setNewListingModalOpen] = useState(false);
  const [customDomainModalOpen, setCustomDomainModalOpen] = useState(false);

  // Handlers
  const handleHeroSearch = (query: string, taluk: string, category: string) => {
    setSearchQuery(query);
    setSearchTaluk(taluk);
    setSearchCategory(category);
    setCurrentTab('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestinationForModal(dest);
  };

  const handleBookBusiness = (biz: Business) => {
    setSelectedBusinessForBooking(biz);
  };

  const handleBookingSuccess = (booking: Booking) => {
    // Optionally navigate to dashboard to show booking in 'pending' status
    // Stay smooth
  };

  const handleListingCreated = (newBiz: Business) => {
    setBusinesses(getBusinesses());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 selection:bg-[#2d5a43] selection:text-white">
      {/* 3-Zone Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAIAssistant={() => setAiAssistantOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            <Hero
              onSearch={handleHeroSearch}
              onOpenAI={() => setAiAssistantOpen(true)}
              onExploreNow={() => {
                setCurrentTab('destinations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <PopularDestinations
              destinations={destinations}
              onSelectDestination={handleSelectDestination}
              onViewAll={() => {
                setCurrentTab('destinations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <HiddenGemsSection
              destinations={destinations}
              onSelectDestination={handleSelectDestination}
              onExploreMoreGems={() => {
                setCurrentTab('hiddengems');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <MarketplaceShowcase
              businesses={businesses}
              onSelectBusiness={(biz) => {
                setSelectedBusinessForBooking(biz);
              }}
              onBookBusiness={handleBookBusiness}
              onViewAllMarketplace={(category) => {
                if (category) setMarketplaceCategory(category);
                setCurrentTab('marketplace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <WhyChooseLocalora />

            <Testimonials />
          </div>
        )}

        {currentTab === 'destinations' && (
          <DestinationExplorer
            destinations={destinations}
            businesses={businesses}
            onBookBusiness={handleBookBusiness}
            onSelectBusiness={(biz) => handleBookBusiness(biz)}
            initialQuery={searchQuery}
            initialTaluk={searchTaluk}
            initialCategory={searchCategory}
          />
        )}

        {currentTab === 'marketplace' && (
          <MarketplaceExplorer
            businesses={businesses}
            onBookBusiness={handleBookBusiness}
            onOpenNewListingModal={() => setNewListingModalOpen(true)}
            initialCategory={marketplaceCategory}
          />
        )}

        {currentTab === 'hiddengems' && (
          <div className="min-h-screen">
            <HiddenGemsSection
              destinations={destinations}
              onSelectDestination={handleSelectDestination}
              onExploreMoreGems={() => {
                setCurrentTab('destinations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">
                Featured Unexplored Destinations in Detail
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations
                  .filter((d) => d.isFeaturedHiddenGem)
                  .map((gem) => (
                    <div
                      key={gem.id}
                      onClick={() => handleSelectDestination(gem)}
                      className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-xs cursor-pointer flex flex-col justify-between"
                    >
                      <div className="aspect-4/3 w-full overflow-hidden bg-stone-100">
                        <img src={gem.image} alt={gem.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5">
                        <div className="text-[11px] font-semibold text-[#2d5a43] uppercase tracking-wider">
                          {gem.taluk} Taluk &middot; {gem.travelInfo.trekDifficulty} Trek
                        </div>
                        <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">{gem.name}</h3>
                        <p className="mt-2 text-xs text-stone-600 line-clamp-2">{gem.description}</p>
                        <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                          <span className="text-stone-500">{gem.estimatedBudget}</span>
                          <span className="font-semibold text-[#2d5a43]">Explore Secret &rarr;</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'map' && (
          <InteractiveTourismMap
            destinations={destinations}
            businesses={businesses}
            onSelectDestination={handleSelectDestination}
            onBookBusiness={handleBookBusiness}
          />
        )}

        {currentTab === 'itinerary' && (
          <ItineraryGenerator
            onExploreDestinations={() => {
              setCurrentTab('destinations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreMarketplace={() => {
              setCurrentTab('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'dashboard' && (
          <>
            {role === 'tourist' && (
              <TouristDashboard
                onSelectDestination={handleSelectDestination}
                onBookBusiness={handleBookBusiness}
                onExploreDestinations={() => {
                  setCurrentTab('destinations');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
            {role === 'business_owner' && <BusinessDashboard />}
            {role === 'admin' && <AdminDashboard />}
          </>
        )}

        {currentTab === 'privacy' && (
          <PrivacyPolicy
            onBack={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'terms' && (
          <TermsConditions
            onBack={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCustomDomain={() => setCustomDomainModalOpen(true)}
      />

      {/* Interactive Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <LocaloraAssistantModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        onExploreDestination={(destName) => {
          setSearchQuery(destName);
          setCurrentTab('destinations');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <DestinationDetailModal
        destination={selectedDestinationForModal}
        onClose={() => setSelectedDestinationForModal(null)}
        businesses={businesses}
        onBookBusiness={handleBookBusiness}
        onSelectBusiness={handleBookBusiness}
      />

      <BookingModal
        business={selectedBusinessForBooking}
        isOpen={Boolean(selectedBusinessForBooking)}
        onClose={() => setSelectedBusinessForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      <NewListingModal
        isOpen={newListingModalOpen}
        onClose={() => setNewListingModalOpen(false)}
        onListingCreated={handleListingCreated}
      />

      <CustomDomainModal
        isOpen={customDomainModalOpen}
        onClose={() => setCustomDomainModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
