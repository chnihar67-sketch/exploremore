import React, { useState } from 'react';
import { Business, Booking } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { createBooking, getBookings } from '../../services/storage';
import { X, Calendar, Users, Info, ShieldCheck, Check } from 'lucide-react';

interface BookingModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  business,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const { user } = useAuth();

  // Booking fields
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const after = new Date();
    after.setDate(after.getDate() + 3);
    return after.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [touristName, setTouristName] = useState(user?.name || '');
  const [touristPhone, setTouristPhone] = useState(user?.phone || '+91 98440 12345');
  const [touristEmail, setTouristEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  if (!isOpen || !business) return null;

  const isHomestay = business.category === 'homestay';

  // Calculate nights / duration
  const nights = Math.max(
    1,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  // Price calculation
  const calculatedTotal = isHomestay
    ? business.price * nights
    : business.priceUnit.includes('person')
    ? business.price * guests
    : business.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startDate) {
      setError('Please select a start date');
      return;
    }

    if (isHomestay && new Date(endDate) <= new Date(startDate)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    if (!touristName || !touristEmail || !touristPhone) {
      setError('Please fill in your contact information');
      return;
    }

    // Duplicate check
    const existingBookings = getBookings();
    const isDuplicate = existingBookings.some(
      (b) =>
        b.businessId === business.id &&
        b.touristEmail.toLowerCase() === touristEmail.toLowerCase() &&
        b.date === startDate &&
        b.status !== 'cancelled' &&
        b.status !== 'rejected'
    );

    if (isDuplicate) {
      setError('You already have an active booking request with this host for this date.');
      return;
    }

    setIsSubmitting(true);

    const newBooking = createBooking({
      businessId: business.id,
      businessName: business.name,
      businessCategory: business.category,
      businessImage: business.images[0],
      businessOwnerId: business.ownerId,
      touristId: user?.id || `guest-${Date.now()}`,
      touristName,
      touristEmail,
      touristPhone,
      date: startDate,
      endDate: isHomestay ? endDate : undefined,
      guests,
      totalPrice: calculatedTotal,
      specialRequests: specialRequests.trim() || undefined,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessBooking(newBooking);
      onBookingSuccess(newBooking);
    }, 400);
  };

  const handleModalClose = () => {
    setSuccessBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#faf7f2] w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200">
          <div>
            <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
              Booking Request
            </div>
            <h2 className="text-base font-serif font-bold text-stone-900 line-clamp-1">
              {business.name}
            </h2>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {successBooking ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-[#e7efe9] text-[#2d5a43] rounded-xl flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1b4332]">
              Booking Request Submitted!
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              Your request for <strong>{business.name}</strong> on {startDate} has been dispatched to host{' '}
              <strong>{business.ownerName}</strong>.
            </p>
            <div className="p-4 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 text-left space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-400">Booking Reference:</span>
                <span className="font-mono font-medium">{successBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Initial Status:</span>
                <span className="font-semibold text-amber-600 uppercase">Pending Host Review</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Estimated Total:</span>
                <span className="font-bold text-stone-900">₹{calculatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 italic">
              No payment is deducted now. You can track this request in your &quot;My Trips&quot; dashboard.
            </p>
            <button
              onClick={handleModalClose}
              className="w-full py-2.5 px-4 bg-[#2d5a43] text-white rounded-xl text-xs font-semibold hover:bg-[#1b4332] transition-colors"
            >
              Done &amp; View Trips
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 leading-snug">
                {error}
              </div>
            )}

            {/* Dates row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#2d5a43]" />
                  <span>{isHomestay ? 'Check-in Date' : 'Experience Date'}</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
                />
              </div>

              {isHomestay ? (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#2d5a43]" />
                    <span>Check-out Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#2d5a43]" />
                    <span>Guests / Travellers</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
                  />
                </div>
              )}
            </div>

            {isHomestay && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#2d5a43]" />
                  <span>Number of Guests</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
                />
              </div>
            )}

            {/* Tourist details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={touristName}
                  onChange={(e) => setTouristName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={touristPhone}
                  onChange={(e) => setTouristPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={touristEmail}
                onChange={(e) => setTouristEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Special Requests or Dietary Preferences
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Vegetarian Malnad food, arrival around 4 PM, spice plantation tour interest..."
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
              />
            </div>

            {/* Price breakdown box */}
            <div className="p-3.5 bg-stone-100 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>
                  Base Rate ({isHomestay ? `${nights} night(s)` : business.priceUnit})
                </span>
                <span className="font-mono">₹{business.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Taxes &amp; Local Heritage Fund</span>
                <span>Included</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                <span>Estimated Total</span>
                <span className="text-[#1b4332] font-mono">₹{calculatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-stone-500">
              <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>
                This sends a direct request to the host. No payment is charged now. Host confirmation is guaranteed within 24 hours.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-xl text-xs font-semibold transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Request...' : 'Send Booking Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
