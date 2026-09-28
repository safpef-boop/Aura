import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneMockupPreview } from './PhoneMockupPreview';
import { PhoneSelector } from './PhoneSelector';
import { CaseTypeSelector } from './CaseTypeSelector';
import { ImageControls } from './ImageControls';
import { TextControls } from './TextControls';
import {
  Smartphone,
  Shield,
  Image as ImageIcon,
  Type,
  Eye,
  ShoppingCart,
  Bookmark,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export const CustomizerStudio: React.FC = () => {
  const {
    phoneModels,
    selectedPhoneModel,
    setSelectedPhoneModel,
    caseTypes,
    selectedCaseType,
    setSelectedCaseType,
    customDesign,
    setCustomDesign,
    resetCustomDesign,
    saveCurrentDesignToAccount,
    addToCart,
    setCurrentView,
    setIsCoverAIOpen,
  } = useApp();

  const [activeStep, setActiveStep] = useState<number>(3); // Default on Upload/Design
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Dynamic price calculation
  const calculatedUnitPrice = Math.round(
    (selectedCaseType.basePricePKR * selectedPhoneModel.basePriceMultiplier) / 50
  ) * 50;

  const handleAddToCart = () => {
    if (!customDesign.approvedPreview) {
      alert('Please check the "Preview Approved" box to verify your layout before adding to cart.');
      return;
    }

    addToCart({
      itemType: 'custom',
      customDesign: {
        ...customDesign,
        title: `${selectedPhoneModel.name} Personalized Case`,
      },
      phoneModel: selectedPhoneModel,
      caseType: selectedCaseType,
      quantity: 1,
      unitPricePKR: calculatedUnitPrice,
    });

    setCurrentView('cart');
  };

  const handleSaveToAccount = () => {
    saveCurrentDesignToAccount();
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const steps = [
    { id: 1, name: 'Phone', icon: Smartphone, label: selectedPhoneModel.name },
    { id: 2, name: 'Case Finish', icon: Shield, label: selectedCaseType.name },
    { id: 3, name: 'Photo & Art', icon: ImageIcon, label: customDesign.uploadedImage ? 'Photo Attached' : 'Choose Art' },
    { id: 4, name: 'Text', icon: Type, label: customDesign.textLayers[0]?.text || 'Monogram' },
    { id: 5, name: 'Approve', icon: Eye, label: customDesign.approvedPreview ? 'Approved ✓' : 'Review' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Studio Header & Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Atelier Customization Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-brand-display">
            Create Your Custom Cover
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Precision laser-cut specifically for {selectedPhoneModel.brand} {selectedPhoneModel.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCoverAIOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ask CoverAI Designer</span>
          </button>

          <button
            onClick={resetCustomDesign}
            className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Reset Canvas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Indicators Navigation */}
      <div className="flex items-center gap-1 sm:gap-2 py-4 overflow-x-auto no-scrollbar border-b border-neutral-100 mb-6">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
              <span>Step {step.id}: {step.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio 3-Column Layout on Desktop / Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls for Active Step (5 cols) */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
          {activeStep === 1 && (
            <PhoneSelector
              phoneModels={phoneModels}
              selectedPhoneModel={selectedPhoneModel}
              onSelectPhoneModel={setSelectedPhoneModel}
            />
          )}

          {activeStep === 2 && (
            <CaseTypeSelector
              caseTypes={caseTypes}
              selectedCaseType={selectedCaseType}
              onSelectCaseType={setSelectedCaseType}
              phoneModel={selectedPhoneModel}
            />
          )}

          {activeStep === 3 && (
            <ImageControls
              design={customDesign}
              onUpdateDesign={setCustomDesign}
              onOpenCoverAI={() => setIsCoverAIOpen(true)}
            />
          )}

          {activeStep === 4 && (
            <TextControls
              design={customDesign}
              onUpdateDesign={setCustomDesign}
            />
          )}

          {activeStep === 5 && (
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                Final Review & Print Approval
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Before printing in our Lahore studio, please ensure:
              </p>
              <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside">
                <li>No important photo faces are covered by the {selectedPhoneModel.cameraCutout.shape} camera cutout.</li>
                <li>Your custom inscription or monogram is spelled accurately.</li>
                <li>Image resolution meets 300+ DPI standards for razor-sharp UV printing.</li>
              </ul>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                <span className="font-semibold block mb-0.5">1-Year Zero-Fade Guarantee</span>
                Our industrial German UV laser printers guarantee your custom case will not fade or peel for 12 months.
              </div>

              <button
                onClick={() => setCustomDesign((p) => ({ ...p, approvedPreview: !p.approvedPreview }))}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  customDesign.approvedPreview
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {customDesign.approvedPreview
                    ? 'Design Approved ✓ (Click to toggle)'
                    : 'I Approve This Design Preview'}
                </span>
              </button>
            </div>
          )}

          {/* Step Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            {activeStep > 1 ? (
              <button
                onClick={() => setActiveStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold cursor-pointer"
              >
                Previous Step
              </button>
            ) : <div />}

            {activeStep < 5 && (
              <button
                onClick={() => setActiveStep((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold cursor-pointer"
              >
                <span>Next: {steps[activeStep]?.name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Real-Time Live Phone Mockup Stage (4 cols) */}
        <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 shadow-xs sticky top-24">
          <PhoneMockupPreview
            model={selectedPhoneModel}
            caseType={selectedCaseType}
            design={customDesign}
            onUpdateDesign={setCustomDesign}
            interactive={true}
          />
        </div>

        {/* RIGHT COLUMN: Live Order Summary & Actions (3 cols) */}
        <div className="lg:col-span-3 order-3 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-4 sticky top-24">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Live Order Specification
            </h2>

            {/* Selected Spec Card */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Phone Model:</span>
                <span className="font-semibold text-neutral-900 text-right">{selectedPhoneModel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Finish:</span>
                <span className="font-semibold text-neutral-900 text-right">{selectedCaseType.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Custom Photo:</span>
                <span className="font-semibold text-neutral-900">
                  {customDesign.uploadedImage ? 'Custom Artwork Attached ✓' : 'Studio Texture'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Monogram:</span>
                <span className="font-semibold text-neutral-900">
                  {customDesign.textLayers[0]?.text || 'None'}
                </span>
              </div>
            </div>

            {/* Dynamic Total Price */}
            <div className="pt-2 border-t border-neutral-200">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-neutral-500">Custom Cover Total:</span>
                <span className="text-2xl font-extrabold text-neutral-900 font-mono tracking-tight">
                  PKR {calculatedUnitPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Inclusive of GST and model-specific precision laser tooling.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!customDesign.approvedPreview}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  customDesign.approvedPreview
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-white hover:shadow-md'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Custom Cover To Cart</span>
              </button>

              {!customDesign.approvedPreview && (
                <p className="text-[11px] text-amber-800 text-center font-medium">
                  Approve preview in Step 5 before adding to cart.
                </p>
              )}

              <button
                onClick={handleSaveToAccount}
                className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Unfinished Design</span>
              </button>

              {saveSuccessNotice && (
                <div className="p-2 text-center text-xs text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200 font-medium">
                  Saved to your account! You can resume designing anytime.
                </div>
              )}
            </div>

            {/* Trust highlights */}
            <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-600 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>JazzCash & Easypaisa Instant Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Cash on Delivery (COD) Available Nationwide</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>TCS / Trax Express 2-4 Days Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
