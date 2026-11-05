import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addBusiness } from '../../services/storage';
import { BusinessCategory, Business } from '../../types';
import { X, Building2, MapPin, DollarSign, Image as ImageIcon, Check } from 'lucide-react';

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated: (biz: Business) => void;
}

export const NewListingModal: React.FC<NewListingModalProps> = ({
  isOpen,
  onClose,
  onListingCreated,
}) => {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('homestay');
  const [location, setLocation] = useState('Tirthahalli, Shivamogga');
  const [district, setDistrict] = useState('Shivamogga');
  const [price, setPrice] = useState(2500);
  const [priceUnit, setPriceUnit] = useState('per night (includes all meals)');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/traditional_malnad_homestay_1793847866059.jpg');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 94812 34501');
  const [contactEmail, setContactEmail] = useState(user?.email || 'host@localora.org');
  const [amenities, setAmenities] = useState('Traditional Malnad meals, Plantation walk, Hot water, Parking');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !description || !shortDescription) {
      setError('Please provide all listing descriptions and details.');
      return;
    }

    const newBiz = addBusiness({
      name,
      ownerId: user?.id || `user-host-${Date.now()}`,
      ownerName: user?.name || 'Local Host',
      category,
      location,
      district,
      price,
      priceUnit,
      shortDescription,
      description,
      images: [imageUrl, '/src/assets/images/hero_western_ghats_1793847865500.jpg'],
      availability: 'Available',
      contactPhone,
      contactEmail,
      amenitiesOrServices: amenities.split(',').map((s) => s.trim()).filter(Boolean),
      coordinates: {
        lat: 13.68 + (Math.random() - 0.5) * 0.1,
        lng: 75.2 + (Math.random() - 0.5) * 0.1,
      },
      isSampleDemo: false,
    });

    onListingCreated(newBiz);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#faf7f2] w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#2d5a43]" />
            <h2 className="text-base font-serif font-bold text-stone-900">
              List Your Local Tourism Business
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Business Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Sahyadri Valley View Homestay"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
              >
                <option value="homestay">Homestay</option>
                <option value="tour_guide">Tour Guide</option>
                <option value="adventure">Adventure &amp; 4x4</option>
                <option value="restaurant">Traditional Restaurant</option>
                <option value="cultural">Cultural Walk</option>
                <option value="handicraft">Handicrafts</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Location &amp; Taluk</label>
              <input
                type="text"
                required
                placeholder="e.g. Tirthahalli, Shivamogga"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Price Unit</label>
              <input
                type="text"
                required
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                placeholder="e.g. per night / per day"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Short Tagline (1 sentence)</label>
            <input
              type="text"
              required
              placeholder="e.g. Authentic wooden house amidst areca plantations with homecooked Akki Rotti."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              required
              placeholder="Tell travelers about your heritage, hospitality, nearby spots, meals, and what makes your stay special..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Amenities / Services (Comma-separated)</label>
            <input
              type="text"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="e.g. Free breakfast, Plantation tour, Wi-Fi, Hot water"
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg font-semibold shadow-xs"
            >
              Submit for Admin Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
