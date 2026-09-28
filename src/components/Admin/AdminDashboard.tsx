import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneModel, CameraCutoutShape } from '../../types';
import {
  Smartphone,
  Plus,
  Trash2,
  Edit,
  Download,
  Package,
  Settings,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Truck,
  MessageCircle,
  Eye,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    phoneModels,
    addPhoneModel,
    deletePhoneModel,
    orders,
    storeSettings,
    updateStoreSettings,
    products,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'models' | 'orders' | 'settings'>('models');

  // New Phone Model Form State
  const [newBrand, setNewBrand] = useState('Apple');
  const [newName, setNewName] = useState('');
  const [newCutoutShape, setNewCutoutShape] = useState<CameraCutoutShape>('triple-plateau');
  const [newPriceMultiplier, setNewPriceMultiplier] = useState(1.0);
  const [isAddingModel, setIsAddingModel] = useState(false);

  // Settings form state
  const [whatsappNumber, setWhatsappNumber] = useState(storeSettings.whatsappNumber);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    storeSettings.freeShippingThresholdPKR
  );
  const [announcement, setAnnouncement] = useState(storeSettings.announcementText);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleAddNewPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const modelId = `${newBrand.toLowerCase()}-${slug}`;

    const newModel: PhoneModel = {
      id: modelId,
      brand: newBrand,
      name: newName,
      slug,
      dimensions: {
        widthMm: 76.0,
        heightMm: 161.0,
        depthMm: 8.2,
        aspectRatio: 0.475,
        outerCornerRadius: 34,
      },
      cameraCutout: {
        shape: newCutoutShape,
        x: 10,
        y: 8,
        width: 42,
        height: 26,
        radius: 18,
      },
      buttons: {
        left: [{ topPercent: 25, heightPercent: 7, label: 'Volume' }],
        right: [{ topPercent: 24, heightPercent: 8, label: 'Power' }],
      },
      safeMarginPercent: 6,
      basePriceMultiplier: newPriceMultiplier,
      available: true,
      isPopular: false,
    };

    addPhoneModel(newModel);
    setNewName('');
    setIsAddingModel(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      ...storeSettings,
      whatsappNumber,
      freeShippingThresholdPKR: Number(freeShippingThreshold),
      announcementText: announcement,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Production team export helper
  const handleDownloadArtworkSpecs = (order: any) => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(order, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PRODUCTION-${order.orderNumber}-SPEC.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Title */}
      <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-brand-display">
            Aura Atelier Admin Panel
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage phone model tooling, inspect customized print orders, and configure Pakistani store settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'models' ? 'bg-white text-neutral-900' : 'bg-neutral-800 text-neutral-300'
            }`}
          >
            Phone Tooling
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-neutral-900' : 'bg-neutral-800 text-neutral-300'
            }`}
          >
            Orders & Artwork ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-white text-neutral-900' : 'bg-neutral-800 text-neutral-300'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* TAB 1: PHONE MODELS & TEMPLATES */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Supported Smartphone Models ({phoneModels.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Add newly launched flagship or mid-range phones without touching code.
              </p>
            </div>

            <button
              onClick={() => setIsAddingModel(!isAddingModel)}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingModel ? 'Close Form' : 'Add New Phone Model'}</span>
            </button>
          </div>

          {/* New Phone Model Form */}
          {isAddingModel && (
            <form
              onSubmit={handleAddNewPhone}
              className="p-5 sm:p-6 bg-white rounded-2xl border-2 border-neutral-900 shadow-md space-y-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                New Model CAD Tooling Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Brand</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-neutral-50"
                  >
                    {['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Redmi', 'Vivo', 'Oppo', 'Infinix', 'Tecno', 'Realme'].map(
                      (b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Model Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. iPhone 17 Slim or S26+"
                    required
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Camera Cutout Geometry
                  </label>
                  <select
                    value={newCutoutShape}
                    onChange={(e) => setNewCutoutShape(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl bg-neutral-50"
                  >
                    <option value="triple-plateau">Triple Plateau (iPhone Pro)</option>
                    <option value="pill-vertical">Vertical Pill (iPhone Base)</option>
                    <option value="galaxy-ultra-rings">Floating Individual Rings (S Ultra)</option>
                    <option value="galaxy-vertical">Vertical Column (Galaxy A / Plus)</option>
                    <option value="pixel-visor">Visor Horizontal Bar (Pixel)</option>
                    <option value="oneplus-circular">Circular Watch Dial (OnePlus)</option>
                    <option value="xiaomi-square">Rectangular Island (Xiaomi)</option>
                    <option value="vivo-circle">Centered Circle (Vivo/Oppo)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Base Multiplier (Price factor)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.8"
                    max="1.5"
                    value={newPriceMultiplier}
                    onChange={(e) => setNewPriceMultiplier(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-neutral-900 text-amber-300 font-bold uppercase tracking-wider text-xs cursor-pointer shadow-xs"
              >
                Save Phone Model to Live Store
              </button>
            </form>
          )}

          {/* Models Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Model Name</th>
                    <th className="py-3 px-4">Cutout Shape</th>
                    <th className="py-3 px-4">Aspect Ratio</th>
                    <th className="py-3 px-4">Multiplier</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {phoneModels.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-bold text-neutral-900">{m.brand}</td>
                      <td className="py-3 px-4 font-semibold text-neutral-800">{m.name}</td>
                      <td className="py-3 px-4 text-neutral-600 capitalize">
                        {m.cameraCutout.shape.replace('-', ' ')}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-500">
                        {m.dimensions.aspectRatio}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">
                        {m.basePriceMultiplier}x
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deletePhoneModel(m.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                          title="Delete model"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & PRINT-READY ARTWORK */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">
              Customer Orders & Print-Ready Specifications
            </h2>
            <span className="text-xs text-neutral-500">
              Download JSON spec & original photos for production
            </span>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900 text-sm">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-neutral-900 text-amber-300">
                        {ord.paymentMethod.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ord.orderStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-neutral-500 text-[11px]">
                      Customer: <strong className="text-neutral-800">{ord.customer.fullName}</strong> ({ord.customer.phone}) · {ord.customer.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadArtworkSpecs(ord)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download Print Spec</span>
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ord.items.map((it, i) => (
                    <div
                      key={i}
                      className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-3 text-xs"
                    >
                      <div className="w-12 h-16 rounded-lg bg-neutral-950 overflow-hidden shrink-0 border border-neutral-300 flex items-center justify-center">
                        {it.customDesign?.uploadedImage ? (
                          <img
                            src={it.customDesign.uploadedImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] text-[#D4AF37] font-bold font-mono">
                            {it.customDesign?.textLayers[0]?.text || 'ART'}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-neutral-900 block truncate">
                          {it.phoneModel.name}
                        </span>
                        <span className="text-neutral-500 block truncate">
                          {it.caseType.name} (PKR {it.totalPricePKR.toLocaleString()})
                        </span>
                        {it.customDesign?.textLayers[0] && (
                          <span className="text-[10px] text-amber-800 font-semibold block">
                            Inscription: "{it.customDesign.textLayers[0].text}" ({it.customDesign.textLayers[0].font})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs max-w-xl space-y-4 text-xs"
        >
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
            Pakistani Store Operations & Gateway Numbers
          </h2>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              WhatsApp Support Contact Number
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
            <span className="text-[11px] text-neutral-400">
              Format: +923001234567. Powers the floating concierge button.
            </span>
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Free Shipping Order Threshold (PKR)
            </label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Top Announcement Bar Banner Text
            </label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-bold uppercase tracking-wider text-xs cursor-pointer shadow-xs"
            >
              Save Operations Settings
            </button>
            {settingsSaved && (
              <span className="ml-3 text-emerald-700 font-semibold">
                ✓ Settings saved successfully!
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
