import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getBusinesses,
  getBookingsForBusiness,
  updateBookingStatus,
  updateBusiness,
  getReviews,
} from '../../services/storage';
import { Business, Booking } from '../../types';
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  Wallet,
  Settings,
  Star,
  Phone,
  Mail,
  ShieldCheck,
  Edit3,
  Save,
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { user } = useAuth();
  const allBusinesses = getBusinesses();

  // Find business owned by user or fallback to demo homestay
  const business =
    allBusinesses.find((b) => b.ownerId === user?.id || b.id === user?.businessId) ||
    allBusinesses[0];

  const bookings = business ? getBookingsForBusiness(business.id) : [];
  const reviews = business ? getReviews(business.id) : [];

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(business?.price || 2800);
  const [availability, setAvailability] = useState(business?.availability || 'Available');
  const [description, setDescription] = useState(business?.description || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Host response modal for bookings
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<{
    booking: Booking;
    action: 'confirmed' | 'rejected';
  } | null>(null);
  const [hostNote, setHostNote] = useState('');

  if (!business) return null;

  // Real statistics
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const handleSaveListingChanges = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(business.id, {
      price,
      availability: availability as any,
      description,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleConfirmAction = () => {
    if (!selectedBookingForAction) return;
    updateBookingStatus(
      selectedBookingForAction.booking.id,
      selectedBookingForAction.action,
      hostNote.trim() || undefined
    );
    setSelectedBookingForAction(null);
    setHostNote('');
  };

  return (
    <div className="py-12 bg-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Host Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={business.images[0]}
              alt={business.name}
              className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#2d5a43] uppercase tracking-wider">
                  Host Dashboard &middot; {business.category.replace('_', ' ')}
                </span>
                {business.verified && (
                  <span className="flex items-center gap-1 text-[11px] text-[#1b4332] bg-[#e7efe9] px-2 py-0.5 rounded font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2d5a43]" />
                    Verified Listing
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-0.5">
                {business.name}
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Managed by {business.ownerName} &middot; {business.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Listing & Rates'}</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-[#1b4332] rounded-xl text-xs font-semibold">
            Listing changes saved successfully!
          </div>
        )}

        {/* Edit Listing Drawer Form */}
        {isEditing && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 mb-8 shadow-xs animate-in fade-in duration-200">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
              Update Listing Details
            </h3>
            <form onSubmit={handleSaveListingChanges} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Direct Rate / Price (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                  <div className="text-[11px] text-stone-500 mt-1">{business.priceUnit}</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Current Availability Status
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-medium"
                  >
                    <option value="Available">Available (Accepting Requests)</option>
                    <option value="Limited Dates">Limited Dates Only</option>
                    <option value="On Request">On Request / Inquire First</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Public Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Real Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
              Pending Requests
            </div>
            <div className="text-2xl font-serif font-bold text-amber-600 mt-1 tabular-nums">
              {pendingBookings.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Requires your response</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
              Confirmed Trips
            </div>
            <div className="text-2xl font-serif font-bold text-[#1b4332] mt-1 tabular-nums">
              {confirmedBookings.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Scheduled stays &amp; walks</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
              Total Booking Value
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 mt-1 tabular-nums">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#2d5a43] font-medium mt-1">100% direct revenue</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
              Traveler Rating
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 mt-1 flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums">{business.rating.toFixed(1)}</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">({business.reviewCount} verified reviews)</div>
          </div>
        </div>

        {/* Incoming Requests Section */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Customer Booking Requests ({bookings.length})
            </h2>
            <span className="text-xs text-stone-500">Real-time status updates</span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center">
              <Clock className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <div className="font-serif font-bold text-stone-800">No customer booking requests yet</div>
              <div className="text-xs text-stone-500 mt-1">
                New tourist requests will arrive here for you to accept or decline.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-stone-400">#{booking.id}</span>
                      {booking.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                          Needs Decision
                        </span>
                      )}
                      {booking.status === 'confirmed' && (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          Confirmed by You
                        </span>
                      )}
                      {booking.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800">
                          Declined
                        </span>
                      )}
                      {booking.status === 'cancelled' && (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-600">
                          Tourist Cancelled
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">
                      {booking.touristName}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#2d5a43]" />
                        <span>
                          {booking.date}
                          {booking.endDate ? ` to ${booking.endDate}` : ''}
                        </span>
                      </span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#2d5a43]" />
                        <span>{booking.guests} Guests</span>
                      </span>
                      <span>&middot;</span>
                      <span className="font-bold text-stone-900">
                        ₹{booking.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-stone-500 flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{booking.touristPhone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{booking.touristEmail}</span>
                      </span>
                    </div>

                    {booking.specialRequests && (
                      <div className="mt-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                        <strong>Guest Note:</strong> {booking.specialRequests}
                      </div>
                    )}

                    {booking.notesFromHost && (
                      <div className="mt-2 text-xs text-[#1b4332] bg-[#eef5f0] p-2.5 rounded-lg border border-[#2d5a43]/20">
                        <strong>Your reply to guest:</strong> {booking.notesFromHost}
                      </div>
                    )}
                  </div>

                  {/* Accept / Decline actions */}
                  {booking.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          setSelectedBookingForAction({ booking, action: 'rejected' })
                        }
                        className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline</span>
                      </button>

                      <button
                        onClick={() =>
                          setSelectedBookingForAction({ booking, action: 'confirmed' })
                        }
                        className="px-4 py-2 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept Request</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Verified Customer Reviews ({reviews.length})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">Direct feedback from hosted travelers</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 font-serif font-bold text-xl text-stone-900">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{business.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="font-semibold text-xs text-stone-900">{rev.userName}</div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating}/5</span>
                  </div>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="mt-2 text-[10px] text-stone-400">{rev.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Host Response Modal */}
      {selectedBookingForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
              {selectedBookingForAction.action === 'confirmed'
                ? 'Confirm Booking Request'
                : 'Decline Booking Request'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              For guest {selectedBookingForAction.booking.touristName} on{' '}
              {selectedBookingForAction.booking.date}.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Add a friendly note for the guest (Optional)
                </label>
                <textarea
                  rows={3}
                  value={hostNote}
                  onChange={(e) => setHostNote(e.target.value)}
                  placeholder={
                    selectedBookingForAction.action === 'confirmed'
                      ? 'e.g. Welcome! We will have hot Akki Rotti ready upon arrival. Call me at...'
                      : 'e.g. We are fully booked for those dates due to plantation maintenance...'
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForAction(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold text-white ${
                    selectedBookingForAction.action === 'confirmed'
                      ? 'bg-[#2d5a43] hover:bg-[#1b4332]'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm &amp; Notify Tourist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
