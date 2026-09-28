import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Bookmark,
  Heart,
  MapPin,
  User,
  ExternalLink,
  Edit3,
  Trash2,
  ShoppingCart,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';

export const CustomerAccount: React.FC = () => {
  const {
    orders,
    savedDesigns,
    loadSavedDesign,
    wishlist,
    products,
    setSelectedProductForModal,
    setCurrentView,
    phoneModels,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'saved_designs' | 'orders' | 'wishlist' | 'addresses' | 'profile'>('saved_designs');

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-[#D4AF37] flex items-center justify-center font-brand-display text-xl font-bold shadow-xs">
            H
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-brand-display">
              Hamza Farooq
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Lahore, Pakistan · Member since January 2026 · VIP Atelier Client
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('customize')}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>New Custom Design</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-neutral-200">
        {[
          { id: 'saved_designs', label: `Saved Designs (${savedDesigns.length})`, icon: Bookmark },
          { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
          { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
          { id: 'addresses', label: 'Delivery Addresses', icon: MapPin },
          { id: 'profile', label: 'Profile & Settings', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-800' : 'text-neutral-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SAVED DESIGNS (With Continue Designing) */}
      {activeTab === 'saved_designs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Your Saved Custom Covers</h2>
              <p className="text-xs text-neutral-500">
                Continue designing anytime. Photo positions, fonts, and model cutouts are preserved.
              </p>
            </div>
          </div>

          {savedDesigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDesigns.map((design) => {
                const model = phoneModels.find((m) => m.id === design.phoneModelId) || phoneModels[0];

                return (
                  <div
                    key={design.id}
                    className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:border-neutral-900 transition-all flex flex-col justify-between"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/3] w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
                      {design.uploadedImage ? (
                        <img
                          src={design.uploadedImage}
                          alt={design.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          style={{
                            backgroundColor: design.backgroundColor,
                            backgroundImage: design.backgroundPattern || undefined,
                          }}
                          className="w-full h-full flex items-center justify-center p-4 text-center"
                        >
                          <span className="font-brand-display text-[#D4AF37] font-bold text-xl tracking-widest drop-shadow-md">
                            {design.textLayers[0]?.text || 'AURA'}
                          </span>
                        </div>
                      )}

                      {/* Phone model badge */}
                      <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                        {model.name}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 truncate">
                          {design.title || `${model.name} Custom Case`}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Saved on {new Date(design.updatedAt).toLocaleDateString('en-PK')}
                        </p>
                      </div>

                      <button
                        onClick={() => loadSavedDesign(design)}
                        className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-amber-300 hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Continue Designing</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-neutral-200 space-y-3">
              <Bookmark className="w-8 h-8 text-neutral-300 mx-auto" />
              <h3 className="text-sm font-bold text-neutral-900">Your designs will appear here.</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Customize any phone cover and click "Save Unfinished Design" to resume work later.
              </p>
              <button
                onClick={() => setCurrentView('customize')}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider"
              >
                Create Your First Design
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-neutral-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-PK')} · Total:{' '}
                    <span className="font-bold text-neutral-900 font-mono">
                      PKR {order.totalPKR.toLocaleString()}
                    </span>
                  </span>
                </div>

                <button
                  onClick={() => setCurrentView('tracking')}
                  className="flex items-center gap-1.5 text-xs text-neutral-900 hover:text-amber-800 font-bold self-start sm:self-auto cursor-pointer"
                >
                  <span>Track Courier ({order.courierName})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Items in this order */}
              <div className="space-y-2">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-neutral-900 truncate">{it.phoneModel.name}</span>
                      <span className="text-neutral-500 truncate">({it.caseType.name})</span>
                    </div>
                    <span className="font-mono font-semibold">PKR {it.totalPricePKR.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProductForModal(p)}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden cursor-pointer hover:border-neutral-900 transition-all p-3 space-y-2"
                >
                  <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-100">
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 truncate">{p.name}</h4>
                  <span className="text-xs font-mono font-bold">PKR {p.pricePKR.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-neutral-200">
              <Heart className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-900">Save your favorite covers here.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-neutral-900 shadow-xs space-y-2 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded">
              Default Address
            </span>
            <h4 className="text-sm font-bold text-neutral-900 pt-1">Hamza Farooq</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              House 142, Street 7, Sector Y, DHA Phase 3, Lahore, Punjab 54792
            </p>
            <p className="text-xs text-neutral-500">Phone: 0300 1234567</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Secondary Office Address
            </span>
            <h4 className="text-sm font-bold text-neutral-900 pt-1">Hamza Farooq (Office)</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Floor 4, Tricon Corporate Centre, Main Boulevard, Gulberg II, Lahore
            </p>
            <p className="text-xs text-neutral-500">Phone: 0321 9876543</p>
          </div>
        </div>
      )}

      {/* TAB 5: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs max-w-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
            Account Preferences
          </h3>
          <div>
            <label className="text-neutral-500 block mb-1">Full Name</label>
            <input
              type="text"
              defaultValue="Hamza Farooq"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>
          <div>
            <label className="text-neutral-500 block mb-1">Email</label>
            <input
              type="email"
              defaultValue="hamza.farooq@example.com"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>
          <div>
            <label className="text-neutral-500 block mb-1">Mobile Phone (Pakistan)</label>
            <input
              type="tel"
              defaultValue="0300 1234567"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>
          <button
            onClick={() => alert('Profile updated successfully!')}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-bold uppercase tracking-wider text-xs cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
