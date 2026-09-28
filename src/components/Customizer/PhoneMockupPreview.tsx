import React, { useRef, useState } from 'react';
import { PhoneModel, CaseType, CustomDesign } from '../../types';
import { ShieldCheck, Eye, EyeOff, Sparkles, Download, CheckCircle2 } from 'lucide-react';

interface PhoneMockupPreviewProps {
  model: PhoneModel;
  caseType: CaseType;
  design: CustomDesign;
  onUpdateDesign?: (updater: (prev: CustomDesign) => CustomDesign) => void;
  interactive?: boolean;
}

export const PhoneMockupPreview: React.FC<PhoneMockupPreviewProps> = ({
  model,
  caseType,
  design,
  onUpdateDesign,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mouse & Touch Drag Handlers for Image Panning
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive || !design.uploadedImage || !onUpdateDesign) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX - design.imageTransform.x, y: e.clientY - design.imageTransform.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !onUpdateDesign) return;
    const newX = Math.round(e.clientX - dragStart.x);
    const newY = Math.round(e.clientY - dragStart.y);
    onUpdateDesign((prev) => ({
      ...prev,
      imageTransform: {
        ...prev.imageTransform,
        x: newX,
        y: newY,
      },
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Filter CSS style map
  const getFilterCSS = () => {
    const { brightness, contrast, filter } = design.imageTransform;
    let base = `brightness(${brightness}%) contrast(${contrast}%)`;
    switch (filter) {
      case 'noir':
        return `${base} grayscale(100%) contrast(125%)`;
      case 'warm-luxury':
        return `${base} sepia(25%) saturate(115%) hue-rotate(-10deg)`;
      case 'cinematic':
        return `${base} contrast(135%) saturate(125%)`;
      case 'cyber':
        return `${base} saturate(160%) hue-rotate(20deg) contrast(120%)`;
      case 'sepia':
        return `${base} sepia(85%) contrast(105%)`;
      default:
        return base;
    }
  };

  // Quality assessment based on scale and presence of image
  const getImageQuality = () => {
    if (!design.uploadedImage) return null;
    const scale = design.imageTransform.scale;
    if (scale <= 1.2) {
      return {
        level: 'Excellent ✓',
        desc: '300+ DPI — Ultra High Resolution Print',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      };
    } else if (scale <= 1.8) {
      return {
        level: 'Good ✓',
        desc: '200+ DPI — Crisp & Clear Print Quality',
        color: 'text-amber-800 bg-amber-50 border-amber-200',
      };
    } else {
      return {
        level: 'Zoomed In',
        desc: 'Higher resolution photo recommended for razor-sharp edges',
        color: 'text-orange-800 bg-orange-50 border-orange-200',
      };
    }
  };

  const quality = getImageQuality();

  // Export current preview as high-res download
  const handleExportSpecification = () => {
    const jsonSpec = {
      brand: model.brand,
      model: model.name,
      dimensions: model.dimensions,
      caseType: caseType.name,
      cameraCutout: model.cameraCutout,
      backgroundColor: design.backgroundColor,
      textLayers: design.textLayers,
      imageTransform: design.imageTransform,
      exportedAt: new Date().toISOString(),
      productionNote: 'Precision 2400 DPI Sublimation / UV Laser Print File for Aura Case Studio Pakistan',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonSpec, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${model.slug}-${caseType.finish}-print-spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Camera Cutout Renderer tailored specifically to phone hardware
  const renderCameraCutout = () => {
    const cutout = model.cameraCutout;
    const isGoldTrim = caseType.finish === 'gold_trim';
    const isArmor = caseType.finish === 'armor';

    const bezelColor = isGoldTrim
      ? 'border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
      : isArmor
      ? 'border-neutral-900 bg-neutral-950/95 shadow-md'
      : 'border-neutral-800/80 bg-neutral-950/90 shadow-sm';

    // 1. Triple Plateau (iPhone 16/17 Pro)
    if (cutout.shape === 'triple-plateau') {
      return (
        <div
          style={{
            top: `${cutout.y}%`,
            left: `${cutout.x}%`,
            width: `${cutout.width}%`,
            height: `${cutout.height}%`,
            borderRadius: `${cutout.radius || 20}px`,
          }}
          className={`absolute z-30 pointer-events-none border-2 ${bezelColor} backdrop-blur-md overflow-hidden flex flex-col justify-between p-2 shadow-inner`}
        >
          {/* Subtle titanium plateau texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/40 via-neutral-900/60 to-black/80" />

          {/* Three Camera Lenses */}
          <div className="relative w-full h-full">
            {/* Top-Left Lens */}
            <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-neutral-950 border border-neutral-700/80 shadow-md flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-950 via-neutral-900 to-indigo-900 flex items-center justify-center border border-cyan-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
              </div>
            </div>

            {/* Bottom-Left Lens */}
            <div className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-neutral-950 border border-neutral-700/80 shadow-md flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-950 via-neutral-900 to-indigo-900 flex items-center justify-center border border-cyan-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
              </div>
            </div>

            {/* Right-Middle Lens */}
            <div className="absolute top-1/2 -translate-y-1/2 right-1 w-6 h-6 rounded-full bg-neutral-950 border border-neutral-700/80 shadow-md flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-950 via-neutral-900 to-indigo-900 flex items-center justify-center border border-cyan-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
              </div>
            </div>

            {/* Quad Flash & LiDAR */}
            <div className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-amber-100/90 border border-amber-300 shadow-sm" />
            <div className="absolute bottom-1 right-2 w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700" />
          </div>
        </div>
      );
    }

    // 2. Vertical Pill (iPhone 17 base)
    if (cutout.shape === 'pill-vertical') {
      return (
        <div
          style={{
            top: `${cutout.y}%`,
            left: `${cutout.x}%`,
            width: `${cutout.width}%`,
            height: `${cutout.height}%`,
            borderRadius: '9999px',
          }}
          className={`absolute z-30 pointer-events-none border-2 ${bezelColor} bg-neutral-950 flex flex-col items-center justify-around py-1.5 shadow-md`}
        >
          <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-950 to-neutral-900 border border-cyan-400/30" />
          </div>
          <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-950 to-neutral-900 border border-cyan-400/30" />
          </div>
        </div>
      );
    }

    // 3. Samsung Galaxy S25 / S26 Ultra (Individual Floating Rings)
    if (cutout.shape === 'galaxy-ultra-rings') {
      return (
        <div
          style={{
            top: `${cutout.y}%`,
            left: `${cutout.x}%`,
            width: `${cutout.width}%`,
            height: `${cutout.height}%`,
          }}
          className="absolute z-30 pointer-events-none flex flex-col justify-between"
        >
          {/* Main vertical camera column (3 big lenses) */}
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full bg-neutral-950 border-2 ${
                  isGoldTrim ? 'border-[#D4AF37]' : 'border-neutral-700'
                } shadow-md flex items-center justify-center`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-blue-950 border border-cyan-500/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                </div>
              </div>
            ))}
          </div>

          {/* Secondary right column (Periscope + Flash + Sensor) */}
          <div className="absolute top-1 left-9 flex flex-col gap-2.5 items-center">
            <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300 shadow-sm" />
            <div className="w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700" />
            <div
              className={`w-6 h-6 rounded-full bg-neutral-950 border-2 ${
                isGoldTrim ? 'border-[#D4AF37]' : 'border-neutral-700'
              } flex items-center justify-center`}
            >
              <div className="w-3 h-3 rounded-sm bg-neutral-900 border border-cyan-500/20" />
            </div>
          </div>
        </div>
      );
    }

    // 4. Samsung Vertical 3-ring
    if (cutout.shape === 'galaxy-vertical') {
      return (
        <div
          style={{
            top: `${cutout.y}%`,
            left: `${cutout.x}%`,
            width: `${cutout.width}%`,
            height: `${cutout.height}%`,
          }}
          className="absolute z-30 pointer-events-none flex flex-col gap-2"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full bg-neutral-950 border-2 ${
                isGoldTrim ? 'border-[#D4AF37]' : 'border-neutral-700'
              } shadow-md flex items-center justify-center`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-neutral-900 to-blue-950 border border-cyan-400/20" />
            </div>
          ))}
        </div>
      );
    }

    // 5. Pixel Horizontal Visor Bar
    if (cutout.shape === 'pixel-visor') {
      return (
        <div
          style={{
            top: `${cutout.y}%`,
            left: `${cutout.x}%`,
            width: `${cutout.width}%`,
            height: `${cutout.height}%`,
            borderRadius: `${cutout.radius || 16}px`,
          }}
          className={`absolute z-30 pointer-events-none border-2 ${bezelColor} bg-neutral-950/95 flex items-center justify-between px-3 shadow-lg`}
        >
          <div className="flex items-center gap-1.5 bg-black/80 px-2 py-1 rounded-full border border-neutral-700/60">
            <div className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400/30" />
            </div>
            <div className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400/30" />
            </div>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-amber-100 border border-amber-300" />
        </div>
      );
    }

    // 6. OnePlus / Tecno Circular Dial Island
    if (cutout.shape === 'oneplus-circular' || cutout.shape === 'vivo-circle') {
      return (
        <div
          style={{
            top: `${cutout.y}%`,
            left: `${cutout.x}%`,
            width: `${cutout.width}%`,
            height: `${cutout.height}%`,
            borderRadius: '50%',
          }}
          className={`absolute z-30 pointer-events-none border-2 ${bezelColor} bg-neutral-950 shadow-xl flex items-center justify-center overflow-hidden`}
        >
          {/* Watch bezel fluting ring */}
          <div className="absolute inset-0 border border-neutral-700/50 rounded-full" />
          <div className="grid grid-cols-2 gap-2 p-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400/20" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default / Xiaomi Squircle
    return (
      <div
        style={{
          top: `${cutout.y}%`,
          left: `${cutout.x}%`,
          width: `${cutout.width}%`,
          height: `${cutout.height}%`,
          borderRadius: `${cutout.radius || 18}px`,
        }}
        className={`absolute z-30 pointer-events-none border-2 ${bezelColor} bg-neutral-950/90 shadow-lg p-2 grid grid-cols-2 gap-2`}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400/20" />
          </div>
        ))}
      </div>
    );
  };

  // Case Finish Sheen & Trim Overlays
  const renderFinishOverlay = () => {
    switch (caseType.finish) {
      case 'glossy':
        return (
          <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-transparent via-white/15 to-transparent mix-blend-overlay opacity-80" />
        );
      case 'matte':
        return (
          <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-b from-black/5 to-white/5 opacity-50 mix-blend-soft-light" />
        );
      case 'gold_trim':
        return (
          <>
            <div className="absolute inset-0 pointer-events-none z-25 border-[3px] border-[#D4AF37] rounded-[inherit] shadow-[inset_0_0_8px_rgba(212,175,55,0.4)]" />
            <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-amber-500/5 via-transparent to-amber-300/10" />
          </>
        );
      case 'armor':
        return (
          <>
            {/* Corner bumper reinforcements */}
            <div className="absolute -top-1 -left-1 w-5 h-5 bg-neutral-900 border border-neutral-700 rounded-tl-xl z-25" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 border border-neutral-700 rounded-tr-xl z-25" />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-neutral-900 border border-neutral-700 rounded-bl-xl z-25" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neutral-900 border border-neutral-700 rounded-br-xl z-25" />
            <div className="absolute inset-0 pointer-events-none z-25 border-2 border-neutral-800/80 rounded-[inherit]" />
          </>
        );
      case 'bespoke':
        return (
          <>
            <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
            <div className="absolute bottom-3 right-4 z-25 pointer-events-none">
              <span className="text-[9px] tracking-widest text-[#D4AF37] font-mono uppercase bg-black/60 px-1.5 py-0.5 rounded border border-[#D4AF37]/40">
                Atelier No. 042/100
              </span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // MagSafe Magnetic Ring Overlay
  const renderMagSafeRing = () => {
    if (!design.showMagSafeRing && caseType.finish !== 'magsafe') return null;

    const ringColor = caseType.finish === 'gold_trim' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/70 text-white/70';

    return (
      <div className="absolute inset-0 pointer-events-none z-22 flex flex-col items-center justify-center">
        {/* MagSafe Circle */}
        <div
          className={`w-36 h-36 rounded-full border-2 border-dashed ${ringColor} opacity-75 flex items-center justify-center shadow-sm`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
        </div>
        {/* Alignment Tail */}
        <div className={`w-1.5 h-6 rounded-full border ${ringColor} mt-1 opacity-75`} />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Quick Status Bar above preview */}
      <div className="w-full flex items-center justify-between text-xs text-neutral-600 mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-neutral-900">{model.brand}</span>
          <span className="text-neutral-400">·</span>
          <span>{model.name}</span>
          <span className="text-neutral-400">·</span>
          <span className="capitalize font-medium text-neutral-700">{caseType.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {onUpdateDesign && (
            <button
              onClick={() => onUpdateDesign((p) => ({ ...p, showSafeZone: !p.showSafeZone }))}
              className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer bg-white px-2 py-1 rounded-md border border-neutral-200 shadow-xs"
              title="Toggle safe print zone guide"
            >
              {design.showSafeZone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{design.showSafeZone ? 'Hide Safe Zone' : 'Show Safe Zone'}</span>
            </button>
          )}

          <button
            onClick={handleExportSpecification}
            className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer bg-white px-2 py-1 rounded-md border border-neutral-200 shadow-xs"
            title="Download print-ready production specifications"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Spec</span>
          </button>
        </div>
      </div>

      {/* Main 3D Phone Shell Stage */}
      <div className="relative py-4 px-6 flex items-center justify-center select-none w-full max-w-[380px]">
        {/* Outer Phone Case Chassis Container */}
        <div
          ref={containerRef}
          style={{
            width: '280px',
            height: `${Math.round(280 / model.dimensions.aspectRatio)}px`, // ~570px to 600px tall
            borderRadius: `${model.dimensions.outerCornerRadius}px`,
          }}
          className={`relative bg-neutral-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col justify-center items-center ${
            isDragging ? 'cursor-grabbing' : interactive && design.uploadedImage ? 'cursor-grab' : 'cursor-default'
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Side Hardware Buttons Accents */}
          {model.buttons.left.map((btn, idx) => (
            <div
              key={`btn-l-${idx}`}
              style={{
                top: `${btn.topPercent}%`,
                height: `${btn.heightPercent}%`,
              }}
              className="absolute -left-1 w-1 bg-neutral-700/80 rounded-l-sm shadow-xs z-30"
              title={btn.label}
            />
          ))}

          {model.buttons.right.map((btn, idx) => (
            <div
              key={`btn-r-${idx}`}
              style={{
                top: `${btn.topPercent}%`,
                height: `${btn.heightPercent}%`,
              }}
              className="absolute -right-1 w-1 bg-neutral-700/80 rounded-r-sm shadow-xs z-30"
              title={btn.label}
            />
          ))}

          {/* Background Canvas Layer */}
          <div
            style={{
              backgroundColor: design.backgroundColor,
              backgroundImage: design.backgroundPattern || undefined,
            }}
            className="absolute inset-0 w-full h-full z-0"
          />

          {/* Uploaded Customer Image Layer (Movable, Scalable, Rotatable, Filtered) */}
          {design.uploadedImage && (
            <div
              style={{
                transform: `translate(${design.imageTransform.x}px, ${design.imageTransform.y}px) scale(${design.imageTransform.scale}) rotate(${design.imageTransform.rotation}deg)`,
                filter: getFilterCSS(),
                transition: isDragging ? 'none' : 'transform 0.05s ease-out',
              }}
              className="absolute inset-0 w-full h-full z-1 flex items-center justify-center pointer-events-none"
            >
              <img
                src={design.uploadedImage}
                alt="Custom phone design artwork"
                className="w-full h-full object-cover max-w-none pointer-events-none"
                draggable={false}
              />
            </div>
          )}

          {/* Custom Text / Monogram Layers */}
          {design.textLayers.map((layer) => (
            <div
              key={layer.id}
              style={{
                top: `${layer.y}%`,
                left: `${layer.x}%`,
                transform: 'translate(-50%, -50%)',
                color: layer.color,
                fontSize: `${layer.fontSize}px`,
                fontFamily:
                  layer.font === 'Cinzel'
                    ? 'Cinzel, Georgia, serif'
                    : layer.font === 'Playfair Display'
                    ? 'Playfair Display, Georgia, serif'
                    : layer.font === 'Space Grotesk'
                    ? 'Space Grotesk, monospace'
                    : 'Plus Jakarta Sans, sans-serif',
                fontWeight: layer.isBold ? 700 : 400,
                fontStyle: layer.isItalic ? 'italic' : 'normal',
                letterSpacing: `${layer.letterSpacing}px`,
                textAlign: layer.alignment,
                textShadow:
                  layer.color === '#D4AF37'
                    ? '0 1px 4px rgba(212,175,55,0.4), 0 0 1px rgba(0,0,0,0.8)'
                    : '0 1px 3px rgba(0,0,0,0.6)',
              }}
              className="absolute z-10 pointer-events-none select-none max-w-[85%] break-words leading-tight"
            >
              {layer.text}
            </div>
          ))}

          {/* Model-Specific Camera Cutout Shield */}
          {renderCameraCutout()}

          {/* MagSafe Ring (if active or MagSafe case) */}
          {renderMagSafeRing()}

          {/* Case Finish Sheen & Trims (Glossy, Matte, Gold 24K, Armor) */}
          {renderFinishOverlay()}

          {/* Safe Print Area Dashed Boundary Guide */}
          {design.showSafeZone && (
            <div
              style={{
                margin: `${model.safeMarginPercent}%`,
                borderRadius: `${Math.max(12, model.dimensions.outerCornerRadius - 10)}px`,
              }}
              className="absolute inset-0 pointer-events-none z-24 border border-dashed border-amber-300/70 shadow-[inset_0_0_6px_rgba(245,158,11,0.15)] flex flex-col justify-end items-center pb-2"
            >
              <span className="text-[10px] tracking-wider uppercase font-medium bg-black/70 text-amber-200 px-2 py-0.5 rounded backdrop-blur-xs">
                Safe Print Area
              </span>
            </div>
          )}

          {/* Subtle Outer Protective Chamfer Highlight */}
          <div className="absolute inset-0 pointer-events-none z-28 rounded-[inherit] border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25)]" />
        </div>
      </div>

      {/* Quality & Safe Area Review Banner */}
      <div className="w-full mt-2 flex flex-col gap-2">
        {quality && (
          <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${quality.color}`}>
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{quality.level}</span>
            </div>
            <span className="text-[11px] opacity-90">{quality.desc}</span>
          </div>
        )}

        {interactive && onUpdateDesign && (
          <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50/80 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={design.approvedPreview}
              onChange={(e) => onUpdateDesign((p) => ({ ...p, approvedPreview: e.target.checked }))}
              className="mt-0.5 rounded text-neutral-900 focus:ring-neutral-900 w-4 h-4 border-neutral-300"
            />
            <div className="text-xs">
              <span className="font-semibold text-neutral-900 block">Preview Approved ✓</span>
              <span className="text-neutral-500 block">
                I have reviewed my design and verify all photo focal points and text fit comfortably within the safe print boundary and do not overlap camera cutouts.
              </span>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};
