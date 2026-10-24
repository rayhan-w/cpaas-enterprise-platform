'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ALL_BD_DISTRICTS, getDivisionForDistrict } from '@/lib/bd-locations';
import { MapPin, ChevronDown, Check, Search } from 'lucide-react';

interface SearchableDistrictSelectProps {
  value: string;
  onChange: (district: string) => void;
  required?: boolean;
}

export default function SearchableDistrictSelect({
  value,
  onChange,
  required = false,
}: SearchableDistrictSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDistricts = ALL_BD_DISTRICTS.filter((dist) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const div = getDivisionForDistrict(dist).toLowerCase();
    return dist.toLowerCase().includes(q) || div.includes(q);
  });

  const handleSelect = (dist: string) => {
    onChange(dist);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`w-full bg-[#F8F7F5] border rounded-xl px-3.5 py-2.5 text-xs text-left flex items-center justify-between transition-all cursor-pointer ${
          isOpen
            ? 'border-[#6CAE14] ring-2 ring-[#6CAE14]/20 bg-white'
            : value
            ? 'border-[#EDE5E1] text-[#1A1512] font-semibold'
            : 'border-red-300 text-[#9B8A86]'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#6CAE14] shrink-0" />
          {value ? (
            <span>
              <strong className="text-[#1A1512]">{value}</strong>
              <span className="text-[#6B5B58] ml-1.5 font-normal">
                ({getDivisionForDistrict(value)})
              </span>
            </span>
          ) : (
            <span className="text-[#9B8A86]">জেলা নির্বাচন করুন (Select District)</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#9B8A86] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-[#EDE5E1] rounded-2xl shadow-xl p-2 space-y-2 max-h-72 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
          {/* Search Input */}
          <div className="relative shrink-0 px-1 pt-1">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="জেলা টাইপ করে খুঁজুন (e.g. Gazipur, Rajshahi)..."
              className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 pl-8 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14] focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-[#9B8A86] absolute left-3 top-3.5 pointer-events-none" />
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 divide-y divide-[#F2EDEA] pr-0.5">
            {filteredDistricts.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#9B8A86]">
                কোনো জেলা খুঁজে পাওয়া যায়নি (&ldquo;{search}&rdquo;)
              </div>
            ) : (
              filteredDistricts.map((dist) => {
                const isSelected = value === dist;
                const divName = getDivisionForDistrict(dist);
                return (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => handleSelect(dist)}
                    className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F1F8E8] text-[#6CAE14] font-bold'
                        : 'text-[#1A1512] hover:bg-[#F8F7F5]'
                    }`}
                  >
                    <span>
                      {dist}
                      <span className="text-[10px] text-[#9B8A86] ml-2 font-normal">
                        • {divName}
                      </span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#6CAE14]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
