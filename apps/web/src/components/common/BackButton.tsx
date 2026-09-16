'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  fallback?: string;
  className?: string;
}

export default function BackButton({
  label = 'Back',
  fallback = '/',
  className = '',
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-xs font-semibold text-[#1A1512] hover:text-[#6CAE14] bg-white px-3.5 py-1.5 rounded-full border border-[#EDE5E1] shadow-xs hover:border-[#6CAE14] hover:bg-[#F1F8E8]/40 transition-all cursor-pointer group shrink-0 ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#6B5B58] group-hover:text-[#6CAE14]" />
      <span>{label}</span>
    </button>
  );
}
