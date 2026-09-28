import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { storeSettings, selectedPhoneModel, selectedCaseType } = useApp();

  const cleanNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    `Salam! I am designing a custom case on Aura Case Studio for ${selectedPhoneModel.brand} ${selectedPhoneModel.name} (${selectedCaseType.name}). Could you help me with design questions / order delivery?`
  );

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
      title="Chat with Aura Studio concierge on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <div className="flex flex-col text-left">
        <span className="text-[10px] text-emerald-100 font-medium leading-none">Need Help?</span>
        <span className="text-xs font-bold leading-tight">WhatsApp Us</span>
      </div>
    </a>
  );
};
