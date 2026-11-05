import {
  Destination,
  Business,
  Booking,
  Review,
  SavedItinerary,
  BookingStatus,
} from '../types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_BUSINESSES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
} from '../data/mockData';

const STORAGE_KEYS = {
  DESTINATIONS: 'localora_destinations_v1',
  BUSINESSES: 'localora_businesses_v1',
  BOOKINGS: 'localora_bookings_v1',
  REVIEWS: 'localora_reviews_v1',
  SAVED_DESTINATIONS: 'localora_saved_destinations_v1',
  SAVED_BUSINESSES: 'localora_saved_businesses_v1',
  SAVED_ITINERARIES: 'localora_saved_itineraries_v1',
};

// Event listener for cross-component reactive updates
type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

export const subscribeToData = (listener: StorageListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((l) => l());
};

// Helper for safe JSON parse
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to read from localStorage ${key}:`, e);
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (e) {
    console.error(`Failed to write to localStorage ${key}:`, e);
  }
}

// DESTINATIONS
export const getDestinations = (): Destination[] => {
  return getFromStorage(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
};

export const getDestinationById = (id: string): Destination | undefined => {
  return getDestinations().find((d) => d.id === id);
};

export const addDestination = (dest: Omit<Destination, 'id' | 'rating' | 'reviewCount'>): Destination => {
  const current = getDestinations();
  const newDest: Destination = {
    ...dest,
    id: `dest-${Date.now()}`,
    rating: 5.0,
    reviewCount: 1,
  };
  setToStorage(STORAGE_KEYS.DESTINATIONS, [newDest, ...current]);
  return newDest;
};

// BUSINESSES
export const getBusinesses = (): Business[] => {
  return getFromStorage(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
};

export const getBusinessById = (id: string): Business | undefined => {
  return getBusinesses().find((b) => b.id === id);
};

export const addBusiness = (biz: Omit<Business, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'verified' | 'verificationStatus'>): Business => {
  const current = getBusinesses();
  const newBiz: Business = {
    ...biz,
    id: `biz-${Date.now()}`,
    verified: false,
    verificationStatus: 'pending',
    rating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
  };
  setToStorage(STORAGE_KEYS.BUSINESSES, [newBiz, ...current]);
  return newBiz;
};

export const updateBusiness = (id: string, updates: Partial<Business>): Business | null => {
  const current = getBusinesses();
  const index = current.findIndex((b) => b.id === id);
  if (index === -1) return null;
  const updated = { ...current[index], ...updates };
  current[index] = updated;
  setToStorage(STORAGE_KEYS.BUSINESSES, current);
  return updated;
};

export const verifyBusiness = (id: string, status: 'approved' | 'rejected'): boolean => {
  const current = getBusinesses();
  const index = current.findIndex((b) => b.id === id);
  if (index === -1) return false;
  current[index].verificationStatus = status;
  current[index].verified = status === 'approved';
  setToStorage(STORAGE_KEYS.BUSINESSES, current);
  return true;
};

// BOOKINGS
export const getBookings = (): Booking[] => {
  return getFromStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
};

export const getBookingsForTourist = (touristId: string): Booking[] => {
  return getBookings().filter((b) => b.touristId === touristId);
};

export const getBookingsForBusiness = (businessId: string): Booking[] => {
  return getBookings().filter((b) => b.businessId === businessId);
};

export const createBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Booking => {
  const current = getBookings();
  const newBooking: Booking = {
    ...bookingData,
    id: `book-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  setToStorage(STORAGE_KEYS.BOOKINGS, [newBooking, ...current]);
  return newBooking;
};

export const updateBookingStatus = (bookingId: string, status: BookingStatus, notesFromHost?: string): Booking | null => {
  const current = getBookings();
  const index = current.findIndex((b) => b.id === bookingId);
  if (index === -1) return null;
  const updated = {
    ...current[index],
    status,
    updatedAt: new Date().toISOString(),
    ...(notesFromHost ? { notesFromHost } : {}),
  };
  current[index] = updated;
  setToStorage(STORAGE_KEYS.BOOKINGS, current);
  return updated;
};

// REVIEWS
export const getReviews = (targetId?: string): Review[] => {
  const all = getFromStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  if (targetId) {
    return all.filter((r) => r.targetId === targetId);
  }
  return all;
};

export const addReview = (reviewData: Omit<Review, 'id' | 'date'>): Review => {
  const current = getReviews();
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
  };
  setToStorage(STORAGE_KEYS.REVIEWS, [newReview, ...current]);

  // Update target rating
  if (reviewData.targetType === 'business') {
    const biz = getBusinessById(reviewData.targetId);
    if (biz) {
      const bizReviews = [newReview, ...current.filter((r) => r.targetId === biz.id)];
      const avg = Number((bizReviews.reduce((sum, r) => sum + r.rating, 0) / bizReviews.length).toFixed(2));
      updateBusiness(biz.id, {
        rating: avg,
        reviewCount: bizReviews.length,
      });
    }
  }
  return newReview;
};

// SAVED ITINERARIES
export const getSavedItineraries = (userId: string): SavedItinerary[] => {
  const all = getFromStorage<Record<string, SavedItinerary[]>>(STORAGE_KEYS.SAVED_ITINERARIES, {});
  return all[userId] || [];
};

export const saveUserItinerary = (userId: string, itinerary: Omit<SavedItinerary, 'id' | 'createdAt'>): SavedItinerary => {
  const all = getFromStorage<Record<string, SavedItinerary[]>>(STORAGE_KEYS.SAVED_ITINERARIES, {});
  const userList = all[userId] || [];
  const newItin: SavedItinerary = {
    ...itinerary,
    id: `itin-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  all[userId] = [newItin, ...userList];
  setToStorage(STORAGE_KEYS.SAVED_ITINERARIES, all);
  return newItin;
};

export const deleteUserItinerary = (userId: string, itineraryId: string): void => {
  const all = getFromStorage<Record<string, SavedItinerary[]>>(STORAGE_KEYS.SAVED_ITINERARIES, {});
  if (all[userId]) {
    all[userId] = all[userId].filter((i) => i.id !== itineraryId);
    setToStorage(STORAGE_KEYS.SAVED_ITINERARIES, all);
  }
};

// RESET DEMO DATA
export const resetToDemoData = () => {
  localStorage.removeItem(STORAGE_KEYS.DESTINATIONS);
  localStorage.removeItem(STORAGE_KEYS.BUSINESSES);
  localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  localStorage.removeItem(STORAGE_KEYS.REVIEWS);
  localStorage.removeItem(STORAGE_KEYS.SAVED_ITINERARIES);
  notifyListeners();
};
