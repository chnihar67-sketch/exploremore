import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getBookingsForTourist,
  getDestinations,
  getBusinesses,
  updateBookingStatus,
  getSavedItineraries,
  deleteUserItinerary,
  addReview,
} from '../../services/storage';
import { Booking, Destination, Business, SavedItinerary } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bookmark,
  Trash2,
  Send,
  MessageSquare,
} from 'lucide-react';

interface TouristDashboardProps {
  onSelectDestination: (dest: Destination) => void;
  onBookBusiness: (biz: Business) => void;
  onExploreDestinations: () => void;
}

export const TouristDashboard: React.FC<TouristDashboardProps> = ({
  onSelectDestination,
  onBookBusiness,
  onExploreDestinations,
}) => {
  const { user, toggleSaveDestination, toggleSaveBusiness } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'saved_destinations' | 'saved_stays' | 'itineraries'>('bookings');

  // Review modal state
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!user) return null;

  const bookings = getBookingsForTourist(user.id);
  const allDestinations = getDestinations();
  const allBusinesses = getBusinesses();
  const savedDestinations = allDestinations.filter((d) => user.savedDestinations.includes(d.id));
  const savedBusinesses = allBusinesses.filter((b) => user.savedBusinesses.includes(b.id));
  const savedItineraries = getSavedItineraries(user.id);

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking request?')) {
      updateBookingStatus(bookingId, 'cancelled');
    }
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalBooking || !reviewComment.trim()) return;

    addReview({
      targetType: 'business',
      targetId: reviewModalBooking.businessId,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewModalBooking(null);
      setReviewComment('');
    }, 1200);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#e7efe9] text-[#1b4332]">
            <CheckCircle className="w-3.5 h-3.5 text-[#2d5a43]" />
            <span>Confirmed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Host Review</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Declined by Host</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 text-stone-600">
            <AlertCircle className="w-3.5 h-3.5 text-stone-400" />
            <span>Cancelled</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Completed</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-12 bg-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#2d5a43]"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-semibold text-[#2d5a43] uppercase tracking-wider">
              Tourist Account
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {user.name}
            </h1>
            <p className="text-xs text-stone-500 mt-1">{user.email} &middot; {user.phone || '+91 98440 12345'}</p>
            {user.bio && <p className="text-xs text-stone-600 mt-2 max-w-xl">{user.bio}</p>}
          </div>

          <div className="flex sm:flex-col gap-4 text-center border-t sm:border-t-0 sm:border-l border-stone-200 pt-4 sm:pt-0 sm:pl-8">
            <div>
              <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                {bookings.length}
              </div>
              <div className="text-[11px] text-stone-500">Trip Requests</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                {savedDestinations.length + savedBusinesses.length}
              </div>
              <div className="text-[11px] text-stone-500">Saved Places</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-8 pb-2 border-b border-stone-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-[#2d5a43] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            My Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('saved_destinations')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'saved_destinations'
                ? 'bg-[#2d5a43] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            Saved Destinations ({savedDestinations.length})
          </button>
          <button
            onClick={() => setActiveTab('saved_stays')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'saved_stays'
                ? 'bg-[#2d5a43] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            Saved Stays &amp; Guides ({savedBusinesses.length})
          </button>
          <button
            onClick={() => setActiveTab('itineraries')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'itineraries'
                ? 'bg-[#2d5a43] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            Saved Itineraries ({savedItineraries.length})
          </button>
        </div>

        {/* TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
                <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg text-stone-800">No booking requests yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                  Explore traditional homestays and certified local guides to start planning your Western Ghats adventure.
                </p>
                <button
                  onClick={onExploreDestinations}
                  className="px-4 py-2 bg-[#2d5a43] text-white rounded-lg text-xs font-semibold"
                >
                  Explore Stays &amp; Guides
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={booking.businessImage}
                      alt={booking.businessName}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-stone-400 font-mono">#{booking.id}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">
                        {booking.businessName}
                      </h3>
                      <div className="text-xs text-stone-600 mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#2d5a43]" />
                          <span>
                            {booking.date}
                            {booking.endDate ? ` to ${booking.endDate}` : ''}
                          </span>
                        </span>
                        <span>&middot;</span>
                        <span>{booking.guests} Guest(s)</span>
                        <span>&middot;</span>
                        <span className="font-bold text-stone-900">
                          ₹{booking.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {booking.notesFromHost && (
                        <div className="mt-3 p-3 bg-[#eef5f0] border border-[#2d5a43]/20 rounded-xl text-xs text-[#1b4332]">
                          <strong>Host Note:</strong> {booking.notesFromHost}
                        </div>
                      )}

                      {booking.specialRequests && (
                        <div className="mt-1 text-[11px] text-stone-500 italic">
                          Special request: &ldquo;{booking.specialRequests}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Cancel Request
                      </button>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => setReviewModalBooking(booking)}
                        className="px-3.5 py-1.5 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Leave Review</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SAVED DESTINATIONS */}
        {activeTab === 'saved_destinations' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
                <Heart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <div className="font-serif font-bold text-stone-800">No saved destinations</div>
                <div className="text-xs text-stone-500 mt-1">Tap the heart icon on any destination card to save it.</div>
              </div>
            ) : (
              savedDestinations.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => onSelectDestination(dest)}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-xs cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveDestination(dest.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-white text-red-500 shadow-xs"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-stone-500 uppercase">{dest.taluk} Taluk</div>
                    <h3 className="font-serif font-bold text-base text-stone-900 mt-0.5">{dest.name}</h3>
                    <div className="mt-3 text-xs text-stone-700 flex justify-between items-center">
                      <span>{dest.estimatedBudget}</span>
                      <span className="font-semibold text-[#2d5a43]">View Details &rarr;</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: SAVED STAYS & GUIDES */}
        {activeTab === 'saved_stays' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBusinesses.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
                <Bookmark className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <div className="font-serif font-bold text-stone-800">No saved businesses</div>
                <div className="text-xs text-stone-500 mt-1">Bookmark homestays and guides to easily access them.</div>
              </div>
            ) : (
              savedBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden">
                    <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleSaveBusiness(biz.id)}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-white text-red-500 shadow-xs"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-stone-500 uppercase">{biz.category.replace('_', ' ')}</div>
                    <h3 className="font-serif font-bold text-base text-stone-900 mt-0.5">{biz.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">₹{biz.price} {biz.priceUnit}</span>
                      <button
                        onClick={() => onBookBusiness(biz)}
                        className="px-3 py-1.5 bg-[#2d5a43] text-white text-xs font-semibold rounded-lg"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: SAVED ITINERARIES */}
        {activeTab === 'itineraries' && (
          <div className="space-y-6">
            {savedItineraries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
                <Bookmark className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <div className="font-serif font-bold text-stone-800">No saved itineraries</div>
                <div className="text-xs text-stone-500 mt-1">
                  Use our AI Itinerary Generator to create and save custom day plans.
                </div>
              </div>
            ) : (
              savedItineraries.map((itin) => (
                <div
                  key={itin.id}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-stone-900">{itin.title}</h3>
                      <p className="text-xs text-stone-600 mt-1 max-w-2xl">{itin.overview}</p>
                    </div>
                    <button
                      onClick={() => deleteUserItinerary(user.id, itin.id)}
                      className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                      title="Delete itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {itin.days.map((d) => (
                      <div key={d.dayNumber} className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-[#2d5a43]">Day {d.dayNumber}: {d.title}</div>
                        <div className="text-stone-600 line-clamp-2">{d.morning}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
              Review {reviewModalBooking.businessName}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Share your genuine experience to help fellow travelers and support the local host.
            </p>

            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 text-[#1b4332] text-center text-xs font-semibold rounded-xl">
                Thank you! Your verified review has been submitted.
              </div>
            ) : (
              <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReviewRating(num)}
                        className="p-1 text-stone-300 hover:text-amber-400"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            num <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-700 ml-2">{reviewRating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Feedback</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell us about the hospitality, food, guide insights, or room cleanliness..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalBooking(null)}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
