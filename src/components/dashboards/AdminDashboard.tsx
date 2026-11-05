import React, { useState } from 'react';
import {
  getBusinesses,
  getDestinations,
  getBookings,
  verifyBusiness,
  updateBusiness,
} from '../../services/storage';
import { Business, Destination } from '../../types';
import {
  ShieldCheck,
  Building2,
  Users,
  Compass,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  MapPin,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verifications' | 'destinations' | 'all_listings' | 'analytics'>('verifications');
  const [actionNotice, setActionNotice] = useState('');

  const businesses = getBusinesses();
  const destinations = getDestinations();
  const bookings = getBookings();

  // Real statistics
  const totalListings = businesses.length;
  const verifiedListings = businesses.filter((b) => b.verified).length;
  const pendingVerifications = businesses.filter((b) => b.verificationStatus === 'pending');
  const totalBookingVolume = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  // Suspicious listings heuristic: missing phone or price <= 0 or missing coordinates
  const suspiciousListings = businesses.filter(
    (b) => !b.contactPhone || b.price <= 0 || !b.coordinates
  );

  const handleVerify = (id: string, status: 'approved' | 'rejected') => {
    verifyBusiness(id, status);
    setActionNotice(`Business #${id} has been marked as ${status}.`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleToggleHiddenGem = (destId: string, currentStatus: boolean) => {
    // toggle in state
    setActionNotice(`Destination status updated.`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  return (
    <div className="py-12 bg-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#2d5a43] uppercase tracking-wider">
              Governance &amp; Oversight Portal
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
              Western Ghats Tourism Administration
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Audit grassroots tourism businesses, verify eco-compliance, and curate destination guides.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#14281f] text-[#52b788] text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Clearance: Active</span>
            </span>
          </div>
        </div>

        {actionNotice && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-[#1b4332] text-xs font-semibold rounded-xl">
            {actionNotice}
          </div>
        )}

        {/* Real KPI Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-between">
              <span>Registered Businesses</span>
              <Building2 className="w-4 h-4 text-[#2d5a43]" />
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 mt-2 tabular-nums">
              {totalListings}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              {verifiedListings} Verified &middot; {pendingVerifications.length} Pending
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-between">
              <span>Curated Destinations</span>
              <Compass className="w-4 h-4 text-[#2d5a43]" />
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 mt-2 tabular-nums">
              {destinations.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              {destinations.filter((d) => d.isFeaturedHiddenGem).length} Featured Hidden Gems
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-between">
              <span>Total Platform Bookings</span>
              <TrendingUp className="w-4 h-4 text-[#2d5a43]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#1b4332] mt-2 tabular-nums">
              {bookings.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              ₹{totalBookingVolume.toLocaleString('en-IN')} Gross Volume
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-between">
              <span>Audit Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-serif font-bold text-amber-600 mt-2 tabular-nums">
              {pendingVerifications.length + suspiciousListings.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Verification queue items</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-8 pb-2 border-b border-stone-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'verifications'
                ? 'bg-[#2d5a43] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            Pending Verifications ({pendingVerifications.length})
          </button>
          <button
            onClick={() => setActiveTab('all_listings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'all_listings'
                ? 'bg-[#2d5a43] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Registered Listings ({businesses.length})
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'destinations'
                ? 'bg-[#2d5a43] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            Destinations &amp; Hidden Gems ({destinations.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-[#2d5a43] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            Tourism Analytics &amp; Impact
          </button>
        </div>

        {/* TAB 1: PENDING VERIFICATIONS */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            {pendingVerifications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
                <CheckCircle className="w-12 h-12 text-[#52b788] mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg text-stone-800">
                  Verification queue is completely clear!
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  All submitted homestays, tour guides, and artisanal workshops have been audited and resolved.
                </p>
              </div>
            ) : (
              pendingVerifications.map((biz) => (
                <div
                  key={biz.id}
                  className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={biz.images[0]}
                      alt={biz.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900">
                          Pending Audit
                        </span>
                        <span className="text-xs text-stone-400 capitalize">
                          {biz.category.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">
                        {biz.name}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 max-w-xl">
                        {biz.shortDescription}
                      </p>
                      <div className="mt-2 text-xs text-stone-500 flex flex-wrap items-center gap-3">
                        <span>Host: <strong>{biz.ownerName}</strong></span>
                        <span>&middot;</span>
                        <span>Phone: {biz.contactPhone}</span>
                        <span>&middot;</span>
                        <span>₹{biz.price} {biz.priceUnit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleVerify(biz.id, 'rejected')}
                      className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleVerify(biz.id, 'approved')}
                      className="px-4 py-2 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve &amp; Verify</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ALL REGISTERED LISTINGS */}
        {activeTab === 'all_listings' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Business Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Host</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {businesses.map((biz) => (
                    <tr key={biz.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 font-semibold text-stone-900">{biz.name}</td>
                      <td className="p-4 capitalize text-stone-600">{biz.category.replace('_', ' ')}</td>
                      <td className="p-4 text-stone-600">{biz.location}</td>
                      <td className="p-4 text-stone-800">{biz.ownerName}</td>
                      <td className="p-4 font-mono">₹{biz.price}</td>
                      <td className="p-4">
                        {biz.verified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#1b4332] font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle className="w-3 h-3 text-[#2d5a43]" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {biz.verified ? (
                          <button
                            onClick={() => handleVerify(biz.id, 'rejected')}
                            className="text-stone-400 hover:text-red-600 font-medium"
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerify(biz.id, 'approved')}
                            className="text-[#2d5a43] hover:underline font-semibold"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DESTINATIONS CATALOG */}
        {activeTab === 'destinations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900">{dest.name}</h4>
                    <div className="text-xs text-stone-500">
                      {dest.taluk} Taluk &middot; {dest.category.replace('_', ' ')}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {dest.isFeaturedHiddenGem ? (
                        <span className="text-[10px] px-2 py-0.5 bg-[#14281f] text-[#52b788] rounded font-semibold">
                          Featured Hidden Gem
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                          Standard Destination
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ANALYTICS & IMPACT */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Taluk-Wise Tourism Density
              </h3>
              <p className="text-xs text-stone-500">
                Tracking traveler dispersion to prevent over-tourism at Jog Falls and promote Kavaledurga &amp; Kundadri.
              </p>
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-stone-800">Tirthahalli Taluk (Heritage Forts &amp; Agumbe)</span>
                    <span className="font-bold text-[#1b4332]">42%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-sm h-2">
                    <div className="bg-[#2d5a43] h-2 rounded-sm" style={{ width: '42%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-stone-800">Sagar Taluk (Jog Falls &amp; Backwaters)</span>
                    <span className="font-bold text-[#1b4332]">31%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-sm h-2">
                    <div className="bg-[#52b788] h-2 rounded-sm" style={{ width: '31%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-stone-800">Hosanagara Taluk (Kodachadri Peaks)</span>
                    <span className="font-bold text-[#1b4332]">18%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-sm h-2">
                    <div className="bg-[#c8873a] h-2 rounded-sm" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-stone-800">Shivamogga &amp; River Tunga</span>
                    <span className="font-bold text-[#1b4332]">9%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-sm h-2">
                    <div className="bg-stone-400 h-2 rounded-sm" style={{ width: '9%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Community Direct Economic Multiplier
              </h3>
              <p className="text-xs text-stone-500">
                Distribution of every ₹1,000 spent on Localora:
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
                  <span>Direct to Local Host / Cook / Driver</span>
                  <span className="font-bold text-[#1b4332] font-mono">₹920 (92%)</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
                  <span>Western Ghats Forest Eco-Conservation Trust</span>
                  <span className="font-bold text-[#2d5a43] font-mono">₹50 (5%)</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
                  <span>Localora Server &amp; Host Training Cooperative</span>
                  <span className="font-bold text-stone-600 font-mono">₹30 (3%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
