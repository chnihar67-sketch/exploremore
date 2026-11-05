export type UserRole = 'tourist' | 'business_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  businessId?: string;
  bio?: string;
  savedDestinations: string[];
  savedBusinesses: string[];
  savedItineraries: SavedItinerary[];
  createdAt: string;
}

export type DestinationCategory =
  | 'waterfall'
  | 'hill_station'
  | 'heritage_fort'
  | 'wildlife'
  | 'rainforest'
  | 'cultural';

export interface Destination {
  id: string;
  name: string;
  district: string;
  taluk: string;
  category: DestinationCategory;
  isFeaturedHiddenGem: boolean;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  travelInfo: {
    nearestTown: string;
    roadAccess: string;
    trekDifficulty?: 'Easy' | 'Moderate' | 'Challenging' | 'None';
  };
  estimatedBudget: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  gallery: string[];
  activities: string[];
  nearbyHomestayIds: string[];
  nearbyGuideIds: string[];
}

export type BusinessCategory =
  | 'homestay'
  | 'tour_guide'
  | 'adventure'
  | 'cultural'
  | 'restaurant'
  | 'handicraft';

export interface Business {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  category: BusinessCategory;
  location: string;
  district: string;
  price: number;
  priceUnit: string; // e.g. "per night", "per day", "per person", "per item"
  description: string;
  shortDescription: string;
  images: string[];
  availability: 'Available' | 'Limited Dates' | 'On Request';
  verified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rating: number;
  reviewCount: number;
  contactPhone: string;
  contactEmail: string;
  amenitiesOrServices: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  isSampleDemo: boolean;
  createdAt: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed';

export interface Booking {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: BusinessCategory;
  businessImage: string;
  businessOwnerId: string;
  touristId: string;
  touristName: string;
  touristEmail: string;
  touristPhone: string;
  date: string;
  endDate?: string;
  guests: number;
  totalPrice: number;
  specialRequests?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  notesFromHost?: string;
}

export interface Review {
  id: string;
  targetType: 'destination' | 'business';
  targetId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  destinations: string[];
  estimatedCost: string;
}

export interface BudgetBreakdown {
  accommodation: string;
  food: string;
  activitiesAndGuides: string;
  transportAndMisc: string;
}

export interface SavedItinerary {
  id: string;
  title: string;
  overview: string;
  totalEstimatedBudget: string;
  days: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  localTips: string[];
  createdAt: string;
}
