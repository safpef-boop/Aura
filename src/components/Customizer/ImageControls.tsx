import React, { useRef } from 'react';
import { CustomDesign } from '../../types';
import { CURATED_ART_PRESETS } from '../../data/mockData';
import { Upload, Camera, RotateCw, ZoomIn, Sun, Sliders, Trash2, Palette, Sparkles, Layers } from 'lucide-react';

interface ImageControlsProps {
  design: CustomDesign;
  onUpdateDesign: (updater: (prev: CustomDesign) => CustomDesign) => void;
  onOpenCoverAI?: () => void;
}

const LUXURY_BG_COLORS = [
  { name: 'Obsidian Noir', hex: '#0F172A' },
  { name: 'Midnight Charcoal', hex: '#18181B' },
  { name: 'Warm Off-White', hex: '#FAF9F6' },
  { name: 'Champagne Beige', hex: '#E7E2D8' },
  { name: 'Royal Emerald', hex: '#022C22' },
  { name: 'Imperial Sapphire', hex: '#0F172A' },
  { name: 'Deep Burgundy', hex: '#450A0A' },
  { name: 'Raw Umber', hex: '#292524' },
];

const FILTERS = [
  { id: 'none', label: 'Original' },
  { id: 'noir', label: 'Noir B&W' },
  { id: 'warm-luxury', label: 'Warm Luxury' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'cyber', label: 'Cyber Teal' },
  { id: 'sepia', label: 'Vintage' },
];

export const ImageControls: React.FC<ImageControlsProps> = ({ design, onUpdateDesign, onOpenCoverAI }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 20MB
    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds 20MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUpdateDesign((prev) => ({
        ...prev,
        uploadedImage: dataUrl,
        uploadedImageName: file.name,
        imageTransform: {
          ...prev.imageTransform,
          scale: 1.0,
          x: 0,
          y: 0,
          rotation: 0,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (preset: typeof CURATED_ART_PRESETS[0]) => {
    onUpdateDesign((prev) => ({
      ...prev,
      backgroundPattern: preset.gradient,
      uploadedImage: null,
      textLayers: prev.textLayers.map((tl, i) =>
        i === 0
          ? {
              ...tl,
              font: preset.recommendedFont,
              color: preset.fontColor,
              text: tl.text || preset.sampleText,
            }
          : tl
      ),
    }));
  };

  const handleResetImage = () => {
    onUpdateDesign((prev) => ({
      ...prev,
      uploadedImage: null,
      uploadedImageName: undefined,
      imageTransform: {
        scale: 1.0,
        x: 0,
        y: 0,
        rotation: 0,
        brightness: 100,
        contrast: 100,
        filter: 'none',
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
            Upload Your Photo
          </label>
          {onOpenCoverAI && (
            <button
              onClick={onOpenCoverAI}
              className="text-xs text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Ask CoverAI to enhance</span>
            </button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/png,image/jpeg,image/webp,image/jpg"
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-xs font-medium cursor-pointer shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-lg border border-neutral-300 text-neutral-800 hover:bg-neutral-50 transition-colors text-xs font-medium cursor-pointer"
          >
            <Camera className="w-4 h-4 text-neutral-600" />
            <span>Take a Photo</span>
          </button>
        </div>

        <p className="text-[11px] text-neutral-500 mt-2 text-center">
          Supports JPG, PNG, WEBP up to 20MB. Drag preview to reposition.
        </p>

        {design.uploadedImage && (
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-600 truncate max-w-[200px]">
              {design.uploadedImageName || 'Custom Photo Attached'}
            </span>
            <button
              onClick={handleResetImage}
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Image Adjustments (Only shown when image is loaded) */}
      {design.uploadedImage && (
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
              Transform & Positioning
            </span>
            <button
              onClick={() =>
                onUpdateDesign((prev) => ({
                  ...prev,
                  imageTransform: {
                    ...prev.imageTransform,
                    scale: 1.0,
                    x: 0,
                    y: 0,
                    rotation: 0,
                    brightness: 100,
                    contrast: 100,
                  },
                }))
              }
              className="text-[11px] text-neutral-500 hover:text-neutral-800 cursor-pointer"
            >
              Reset Transforms
            </button>
          </div>

          {/* Scale / Zoom Slider */}
          <div>
            <div className="flex justify-between text-xs text-neutral-600 mb-1">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5" /> Zoom
              </span>
              <span>{Math.round(design.imageTransform.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={design.imageTransform.scale}
              onChange={(e) =>
                onUpdateDesign((p) => ({
                  ...p,
                  imageTransform: { ...p.imageTransform, scale: parseFloat(e.target.value) },
                }))
              }
              className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
            />
          </div>

          {/* Rotation Slider */}
          <div>
            <div className="flex justify-between text-xs text-neutral-600 mb-1">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Rotate
              </span>
              <span>{design.imageTransform.rotation}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={design.imageTransform.rotation}
              onChange={(e) =>
                onUpdateDesign((p) => ({
                  ...p,
                  imageTransform: { ...p.imageTransform, rotation: parseInt(e.target.value, 10) },
                }))
              }
              className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
            />
          </div>

          {/* Brightness Slider */}
          <div>
            <div className="flex justify-between text-xs text-neutral-600 mb-1">
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" /> Brightness
              </span>
              <span>{design.imageTransform.brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              step="5"
              value={design.imageTransform.brightness}
              onChange={(e) =>
                onUpdateDesign((p) => ({
                  ...p,
                  imageTransform: { ...p.imageTransform, brightness: parseInt(e.target.value, 10) },
                }))
              }
              className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
            />
          </div>

          {/* Filter Selection Tabs */}
          <div>
            <span className="text-xs font-medium text-neutral-700 block mb-2">Artistic Color Grade</span>
            <div className="grid grid-cols-3 gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() =>
                    onUpdateDesign((p) => ({
                      ...p,
                      imageTransform: { ...p.imageTransform, filter: f.id },
                    }))
                  }
                  className={`py-1.5 px-2 text-xs rounded-md transition-colors font-medium cursor-pointer ${
                    design.imageTransform.filter === f.id
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Case Base Color Selection */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5 mb-2.5">
          <Palette className="w-3.5 h-3.5" />
          <span>Case Base Shade</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {LUXURY_BG_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() =>
                onUpdateDesign((prev) => ({
                  ...prev,
                  backgroundColor: c.hex,
                  backgroundPattern: undefined,
                }))
              }
              className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer ${
                design.backgroundColor === c.hex && !design.backgroundPattern
                  ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <div
                style={{ backgroundColor: c.hex }}
                className="w-5 h-5 rounded-full border border-black/10 shrink-0"
              />
              <span className="text-[11px] text-neutral-700 truncate">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Curated Luxury Preset Textures */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Studio Textures</span>
          </label>
          <span className="text-[11px] text-neutral-500">1-Tap Apply</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CURATED_ART_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-2.5 rounded-lg border border-neutral-200 hover:border-neutral-400 transition-all cursor-pointer group bg-neutral-50/50 hover:bg-white"
            >
              <div
                style={{ background: preset.gradient }}
                className="w-full h-8 rounded-md mb-2 shadow-inner border border-black/10"
              />
              <span className="text-xs font-semibold text-neutral-900 block truncate group-hover:text-amber-800">
                {preset.name}
              </span>
              <span className="text-[10px] text-neutral-500 block truncate">{preset.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
