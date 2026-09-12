'use client';

import React from 'react';

/**
 * Official bKash Logo SVG
 */
export function BkashLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="bKash"
    >
      {/* bKash Origami Bird Shape */}
      <path
        d="M31.2 5.5L16.8 19.8L28.1 31.2L34.5 13.5L31.2 5.5Z"
        fill="#E2136E"
      />
      <path
        d="M16.8 19.8L7.5 15.2L11.5 28.5L16.8 19.8Z"
        fill="#C90F60"
      />
      <path
        d="M16.8 19.8L28.1 31.2L19.5 35.5L16.8 19.8Z"
        fill="#980046"
      />
      <path
        d="M31.2 5.5L23.5 11.2L28.1 31.2L31.2 5.5Z"
        fill="#ED3882"
      />
      {/* bKash Wordmark */}
      <text
        x="38"
        y="26"
        fill="#E2136E"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="21"
        letterSpacing="-0.5"
      >
        bKash
      </text>
    </svg>
  );
}

/**
 * Official Nagad Logo SVG
 */
export function NagadLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Nagad"
    >
      {/* Nagad Swirl/Flame Mark */}
      <path
        d="M19.5 6C13.5 6 8.5 11 8.5 17C8.5 23.5 14 27.5 20.5 27.5C26 27.5 29.5 23.5 29.5 19C29.5 13.5 25 11.5 21 11.5C16.5 11.5 14.5 14.5 14.5 17.5C14.5 19.5 16 21 18 21C20 21 21.5 19.5 21.5 17.5C21.5 15.5 20 14 18 14"
        stroke="#F4821F"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="21" cy="9" r="3" fill="#D9251D" />
      {/* Nagad Wordmark */}
      <text
        x="36"
        y="25"
        fill="#F4821F"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="19"
        letterSpacing="-0.2"
      >
        nagad
      </text>
    </svg>
  );
}

/**
 * Official Visa Logo SVG
 */
export function VisaLogo({ className = 'h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="VISA"
    >
      <path
        d="M25.4 1.5L16.6 18.5H11.2L6.8 5.2C6.6 4.3 6.4 4 5.7 3.6C4.4 2.9 2.1 2.3 0 1.9L0.2 1.5H8.8C10.1 1.5 11.2 2.4 11.5 3.8L13.7 13.8L19.2 1.5H25.4Z"
        fill="#1A1F71"
      />
      <path
        d="M32.8 13.2C32.8 9.5 27.8 9.2 27.8 7.3C27.8 6.5 28.6 5.7 30.2 5.5C31 5.4 33.2 5.3 35.4 6.3L36.2 2.6C35.1 2.2 33.7 1.8 32 1.8C26.5 1.8 22.6 4.7 22.6 8.8C22.6 11.9 25.4 13.6 27.5 14.7C29.7 15.7 30.5 16.5 30.5 17.5C30.5 19 28.7 19.6 26.9 19.6C24.7 19.6 23.4 19.1 21.8 18.3L20.9 22.2C22.4 22.9 25.1 23.5 27.9 23.5C33.7 23.5 37.5 20.6 37.5 16.3"
        fill="#1A1F71"
      />
      <path
        d="M44.4 1.5L39.8 18.5H35L39.6 1.5H44.4ZM58.2 1.5H53.5C52.4 1.5 51.5 2.1 51.1 3.1L43.8 18.5H49.2L50.3 15.5H56.5L57.1 18.5H61.8L58.2 1.5ZM51.8 11.8L54.3 4.8L55.8 11.8H51.8Z"
        fill="#1A1F71"
      />
    </svg>
  );
}

/**
 * Official Mastercard Logo SVG
 */
export function MastercardLogo({ className = 'h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 50 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mastercard"
    >
      <circle cx="16" cy="16" r="14" fill="#EB001B" />
      <circle cx="34" cy="16" r="14" fill="#F79E1B" />
      <path
        d="M25 5.5C28.2 8.3 30.2 11.9 30.2 16C30.2 20.1 28.2 23.7 25 26.5C21.8 23.7 19.8 20.1 19.8 16C19.8 11.9 21.8 8.3 25 5.5Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

/**
 * Combined Cards Logo (Visa + Mastercard)
 */
export function CardLogosGroup({ className = 'h-5' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="bg-white px-1.5 py-0.5 rounded border border-[#DFECCE] shadow-2xs flex items-center">
        <VisaLogo className="h-3.5 w-auto" />
      </div>
      <div className="bg-white px-1 py-0.5 rounded border border-[#DFECCE] shadow-2xs flex items-center">
        <MastercardLogo className="h-3.5 w-auto" />
      </div>
    </div>
  );
}

/**
 * Cash on Delivery (COD) Badge
 */
export function CodBadge({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 bg-[#F1F8E8] border border-[#6CAE14]/40 rounded-lg px-2.5 py-1 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-[#6CAE14] animate-pulse" />
      <span className="text-[11px] font-bold text-[#0E140E] tracking-tight">
        Cash on Delivery
      </span>
    </div>
  );
}
