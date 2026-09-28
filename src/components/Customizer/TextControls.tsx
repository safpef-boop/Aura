import React from 'react';
import { CustomDesign, CustomTextLayer } from '../../types';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Plus, Trash2 } from 'lucide-react';

interface TextControlsProps {
  design: CustomDesign;
  onUpdateDesign: (updater: (prev: CustomDesign) => CustomDesign) => void;
}

const LUXURY_FONTS = [
  { id: 'Cinzel', label: 'Cinzel (Imperial Luxury)', sampleClass: 'font-brand-display' },
  { id: 'Playfair Display', label: 'Playfair (Editorial Serif)', sampleClass: 'font-serif-luxury' },
  { id: 'Plus Jakarta Sans', label: 'Jakarta (Modern Clean)', sampleClass: 'font-sans' },
  { id: 'Space Grotesk', label: 'Space Grotesk (Tech Atelier)', sampleClass: 'font-mono-luxury' },
];

const FOIL_COLORS = [
  { name: '24K Gold Foil', hex: '#D4AF37' },
  { name: 'Platinum Silver', hex: '#E2E8F0' },
  { name: 'Rose Gold', hex: '#E0A99D' },
  { name: 'Obsidian Black', hex: '#09090B' },
  { name: 'Pure Pearl', hex: '#FAF9F6' },
  { name: 'Emerald Velvet', hex: '#065F46' },
];

export const TextControls: React.FC<TextControlsProps> = ({ design, onUpdateDesign }) => {
  const activeLayer = design.textLayers[0];

  const handleUpdateLayer = (updatedFields: Partial<CustomTextLayer>) => {
    onUpdateDesign((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((tl, index) =>
        index === 0 ? { ...tl, ...updatedFields } : tl
      ),
    }));
  };

  const handleAddDefaultText = () => {
    onUpdateDesign((prev) => ({
      ...prev,
      textLayers: [
        {
          id: `txt-${Date.now()}`,
          text: 'MY NAME',
          font: 'Cinzel',
          fontSize: 22,
          color: '#D4AF37',
          alignment: 'center',
          x: 50,
          y: 78,
          isBold: true,
          isItalic: false,
          letterSpacing: 4,
        },
      ],
    }));
  };

  const handleClearText = () => {
    onUpdateDesign((prev) => ({
      ...prev,
      textLayers: [],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            <span>Custom Text & Monogram</span>
          </label>
          {activeLayer ? (
            <button
              onClick={handleClearText}
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Text</span>
            </button>
          ) : (
            <button
              onClick={handleAddDefaultText}
              className="text-xs text-neutral-900 hover:text-neutral-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Text</span>
            </button>
          )}
        </div>

        {activeLayer ? (
          <div className="space-y-4">
            {/* Input field */}
            <div>
              <input
                type="text"
                value={activeLayer.text}
                onChange={(e) => handleUpdateLayer({ text: e.target.value })}
                placeholder="Enter initials, name or quote..."
                maxLength={40}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50"
              />
              <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
                <span>Try: "Hamza", "Forever", "2026", "Sukoon", "H • F"</span>
                <span>{activeLayer.text.length}/40</span>
              </div>
            </div>

            {/* Font Picker */}
            <div>
              <span className="text-xs font-medium text-neutral-700 block mb-1.5">Luxury Typeface</span>
              <div className="grid grid-cols-2 gap-2">
                {LUXURY_FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleUpdateLayer({ font: font.id })}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      activeLayer.font === font.id
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800'
                    }`}
                  >
                    <span className={`text-sm block ${font.sampleClass} truncate`}>
                      {activeLayer.text || 'Aura 2026'}
                    </span>
                    <span className="text-[10px] opacity-70 block mt-0.5 truncate">{font.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Foil Colors */}
            <div>
              <span className="text-xs font-medium text-neutral-700 block mb-1.5">Foil & Inscription Color</span>
              <div className="grid grid-cols-3 gap-2">
                {FOIL_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleUpdateLayer({ color: c.hex })}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer ${
                      activeLayer.color === c.hex
                        ? 'border-neutral-900 ring-2 ring-neutral-900/10 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: c.hex }}
                      className="w-4 h-4 rounded-full border border-black/15 shadow-xs shrink-0"
                    />
                    <span className="text-[11px] text-neutral-800 font-medium truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size & Spacing Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Size</span>
                  <span>{activeLayer.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="44"
                  value={activeLayer.fontSize}
                  onChange={(e) => handleUpdateLayer({ fontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Tracking</span>
                  <span>{activeLayer.letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={activeLayer.letterSpacing}
                  onChange={(e) => handleUpdateLayer({ letterSpacing: parseInt(e.target.value, 10) })}
                  className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Vertical Position Slider */}
            <div>
              <div className="flex justify-between text-xs text-neutral-600 mb-1">
                <span>Vertical Position (Safe Margin)</span>
                <span>{activeLayer.y}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                value={activeLayer.y}
                onChange={(e) => handleUpdateLayer({ y: parseInt(e.target.value, 10) })}
                className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-neutral-400">
                Positioned below the camera cutout to guarantee clean visibility.
              </span>
            </div>

            {/* Alignment & Style toggles */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                <button
                  onClick={() => handleUpdateLayer({ alignment: 'left' })}
                  className={`p-1.5 rounded-md cursor-pointer ${
                    activeLayer.alignment === 'left' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleUpdateLayer({ alignment: 'center' })}
                  className={`p-1.5 rounded-md cursor-pointer ${
                    activeLayer.alignment === 'center' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleUpdateLayer({ alignment: 'right' })}
                  className={`p-1.5 rounded-md cursor-pointer ${
                    activeLayer.alignment === 'right' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleUpdateLayer({ isBold: !activeLayer.isBold })}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                    activeLayer.isBold
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleUpdateLayer({ isItalic: !activeLayer.isItalic })}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                    activeLayer.isItalic
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-neutral-50/50 rounded-lg border border-dashed border-neutral-200">
            <Type className="w-6 h-6 text-neutral-400 mx-auto mb-1.5" />
            <p className="text-xs text-neutral-500 mb-2">No custom text on this case yet</p>
            <button
              onClick={handleAddDefaultText}
              className="text-xs font-medium text-neutral-900 underline hover:text-neutral-700 cursor-pointer"
            >
              + Add name, initials or quote
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
