'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { trackContact } from '@/lib/tracking';

export default function FloatingWhatsApp() {
  const phone = '01915210799';
  const whatsappUrl = `https://wa.me/8801915210799?text=${encodeURIComponent('Hello Jawata Mart, I want to inquire about an order.')}`;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-40 flex flex-col gap-2">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackContact('WhatsApp')}
        aria-label="Chat on WhatsApp"
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 ring-2 sm:ring-4 ring-white/90 group"
      >
        <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 fill-white text-[#25D366]" />
        <span className="sr-only">WhatsApp Chat</span>
        {/* Tooltip on desktop */}
        <span className="hidden group-hover:block absolute right-16 bg-[#0E140E] text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>

      {/* Direct Call Button (Desktop only; mobile already has Call Us in bottom bar) */}
      <a
        href={`tel:${phone}`}
        onClick={() => trackContact('PhoneCall')}
        aria-label="Direct Phone Call"
        className="hidden sm:flex w-14 h-14 rounded-full bg-[#6CAE14] hover:bg-[#5B960E] text-white items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/80 group"
      >
        <Phone className="w-6 h-6" />
        <span className="sr-only">Call Us</span>
        {/* Tooltip on desktop */}
        <span className="hidden group-hover:block absolute right-16 bg-[#0E140E] text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap">
          Call Hotline: {phone}
        </span>
      </a>
    </div>
  );
}
