export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[#fd6b03]/20 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-[#0d1f61] border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-xl overflow-hidden bg-white flex items-center justify-center p-0.5 shadow-xs ring-1 ring-[#fd6b03]/40">
          <img
            src="/jawata-mart-logo.jpg"
            alt="Jawata Mart"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-[#0d1f61] tracking-wide">
          Jawata Mart
        </p>
        <p className="text-xs text-[#6B5B58] animate-pulse">
          লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
        </p>
      </div>
    </div>
  );
}
