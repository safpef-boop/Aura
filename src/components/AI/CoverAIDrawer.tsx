import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Send, Bot, User, ArrowRight, Wand2, Check } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  suggestedAction?: {
    type: 'apply_style';
    font?: string;
    filter?: string;
    textColor?: string;
    backgroundColor?: string;
    label: string;
  };
}

export const CoverAIDrawer: React.FC = () => {
  const {
    isCoverAIOpen,
    setIsCoverAIOpen,
    selectedPhoneModel,
    selectedCaseType,
    customDesign,
    setCustomDesign,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'generate'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hi! I'm CoverAI 👋\nI can help you choose a phone case, improve your design, prepare your photo, understand pricing, and create ideas for your customized cover.`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Concept Generator state
  const [conceptPrompt, setConceptPrompt] = useState('');
  const [conceptLoading, setConceptLoading] = useState(false);
  const [generatedConcept, setGeneratedConcept] = useState<any>(null);

  const suggestedPrompts = [
    'Help me design my cover',
    'Which case should I choose?',
    'Make my design more premium',
    'Will this image print clearly?',
    'How much will my cover cost?',
    'Show me Pakistani calligraphy ideas',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/cover-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          context: {
            phoneBrand: selectedPhoneModel.brand,
            phoneModel: selectedPhoneModel.name,
            caseType: selectedCaseType.name,
            pricePKR: Math.round(
              (selectedCaseType.basePricePKR * selectedPhoneModel.basePriceMultiplier) / 50
            ) * 50,
            currentDesign: {
              hasUploadedPhoto: !!customDesign.uploadedImage,
              currentText: customDesign.textLayers[0]?.text || '',
              font: customDesign.textLayers[0]?.font,
              textColor: customDesign.textLayers[0]?.color,
              filter: customDesign.imageTransform.filter,
            },
          },
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Here is my recommendation for your custom cover.',
      };

      // Detect if user asked to make it luxurious or style advice
      if (query.toLowerCase().includes('luxur') || query.toLowerCase().includes('premium')) {
        assistantMsg.suggestedAction = {
          type: 'apply_style',
          font: 'Cinzel',
          filter: 'warm-luxury',
          textColor: '#D4AF37',
          backgroundColor: '#0F172A',
          label: 'Apply Luxury Gold & Obsidian Preset',
        };
      }

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to get CoverAI response', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: `For your ${selectedPhoneModel.name}, I recommend keeping focal points below the ${selectedPhoneModel.cameraCutout.shape} camera cutout with high-contrast typography in 24K Gold.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAction = (action: NonNullable<ChatMessage['suggestedAction']>) => {
    setCustomDesign((prev) => ({
      ...prev,
      backgroundColor: action.backgroundColor || prev.backgroundColor,
      imageTransform: {
        ...prev.imageTransform,
        filter: action.filter || prev.imageTransform.filter,
      },
      textLayers: prev.textLayers.map((tl, i) =>
        i === 0
          ? {
              ...tl,
              font: action.font || tl.font,
              color: action.textColor || tl.color,
            }
          : tl
      ),
    }));
  };

  const handleGenerateConcept = async () => {
    if (!conceptPrompt.trim() || conceptLoading) return;
    setConceptLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText: conceptPrompt,
          phoneModel: selectedPhoneModel.name,
        }),
      });
      const data = await res.json();
      setGeneratedConcept(data.concept);
    } catch (err) {
      console.error(err);
    } finally {
      setConceptLoading(false);
    }
  };

  const handleApplyConceptToCanvas = () => {
    if (!generatedConcept) return;
    setCustomDesign((prev) => ({
      ...prev,
      backgroundPattern: generatedConcept.gradient,
      uploadedImage: null,
      textLayers: prev.textLayers.map((tl, i) =>
        i === 0
          ? {
              ...tl,
              font: generatedConcept.recommendedFont || 'Cinzel',
              text: generatedConcept.suggestedText || tl.text,
              color: generatedConcept.palette?.[1] || '#D4AF37',
            }
          : tl
      ),
    }));
    setIsCoverAIOpen(false);
  };

  if (!isCoverAIOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-50">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 shadow-xs">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight">CoverAI</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded font-semibold">
                  Studio Assistant
                </span>
              </div>
              <p className="text-[11px] text-neutral-300">
                Context: {selectedPhoneModel.name} · {selectedCaseType.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCoverAIOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
              activeTab === 'chat'
                ? 'border-b-2 border-neutral-900 text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Design Advice Chat
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-2.5 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'generate'
                ? 'border-b-2 border-neutral-900 text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Generate Design with AI</span>
          </button>
        </div>

        {/* TAB 1: Chat Assistant */}
        {activeTab === 'chat' && (
          <>
            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-neutral-900 text-white rounded-br-xs'
                        : 'bg-neutral-100 text-neutral-800 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>

                    {m.suggestedAction && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-200/60">
                        <button
                          onClick={() => handleApplyAction(m.suggestedAction!)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 text-amber-300 hover:bg-neutral-800 text-[11px] font-semibold transition-colors cursor-pointer shadow-xs"
                        >
                          <Check className="w-3 h-3" />
                          <span>{m.suggestedAction.label}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-xs text-neutral-500">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <span>CoverAI is analyzing your case composition...</span>
                </div>
              )}
            </div>

            {/* Suggested Prompts Pills */}
            <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50/50">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1.5">
                Suggested Questions
              </span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 hover:border-neutral-400 text-[11px] text-neutral-700 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-neutral-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about design, phone cutouts, or luxury ideas..."
                  className="flex-1 px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="p-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}

        {/* TAB 2: Generate Design with AI */}
        {activeTab === 'generate' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Describe Your Dream Cover Theme
              </label>
              <textarea
                rows={3}
                value={conceptPrompt}
                onChange={(e) => setConceptPrompt(e.target.value)}
                placeholder="e.g. Dark luxury emerald marble with subtle Pakistani gold geometric lines and my name in Cinzel font..."
                className="w-full p-3 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  'Dark luxury marble with gold',
                  'Futuristic cyberpunk Karachi neon',
                  'Minimalist black and white Japanese wave',
                  'Mughal imperial geometry',
                ].map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => setConceptPrompt(idea)}
                    className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                  >
                    + {idea}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateConcept}
              disabled={!conceptPrompt.trim() || conceptLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-amber-300 hover:bg-neutral-800 disabled:opacity-50 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Wand2 className="w-4 h-4" />
              <span>{conceptLoading ? 'Crafting Design Concept...' : 'Generate Design Concept'}</span>
            </button>

            {generatedConcept && (
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3 animate-in fade-in">
                <div
                  style={{ background: generatedConcept.gradient }}
                  className="w-full h-24 rounded-lg shadow-inner border border-black/10 flex items-center justify-center p-3 text-center"
                >
                  <span
                    style={{
                      fontFamily: generatedConcept.recommendedFont === 'Cinzel' ? 'Cinzel, serif' : 'serif',
                      color: generatedConcept.palette?.[1] || '#D4AF37',
                    }}
                    className="text-base font-bold tracking-widest drop-shadow-md"
                  >
                    {generatedConcept.suggestedText || 'AURA'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{generatedConcept.title}</h4>
                  <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                    {generatedConcept.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-neutral-500">Palette:</span>
                  {(generatedConcept.palette || []).map((hex: string, idx: number) => (
                    <div
                      key={idx}
                      style={{ backgroundColor: hex }}
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                      title={hex}
                    />
                  ))}
                </div>

                <button
                  onClick={handleApplyConceptToCanvas}
                  className="w-full py-2 px-3 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Apply Concept To My Phone Case</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
