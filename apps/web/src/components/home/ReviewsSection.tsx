import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { INITIAL_REVIEWS } from '@/lib/sample-data';

export default function ReviewsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0D5435] block mb-1">
          Customer Satisfaction
        </span>
        <h2 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
          Trusted by Bangladeshi Families
        </h2>
        <p className="text-xs text-[#6B5B58] mt-2">
          Read verified feedback from real customers across Dhaka, Chittagong, Sylhet and beyond.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {INITIAL_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="ag-card bg-white rounded-2xl p-6 border border-[#EDE5E1] flex flex-col justify-between"
          >
            <div>
              {/* Stars & Quote */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-[#F0B840]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-[#EDE5E1]" />
              </div>

              {/* Comment */}
              <p className="text-xs text-[#1A1512] leading-relaxed italic mb-4">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#F2EDEA]">
              <div className="w-9 h-9 rounded-full bg-[#E7F2EC] text-[#0D5435] font-bold text-xs flex items-center justify-center border border-[#EDE5E1] shrink-0">
                {review.avatar}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1A1512] truncate flex items-center gap-1">
                  <span>{review.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7A9C78] shrink-0" />
                </h4>
                <p className="text-[11px] text-[#9B8A86] truncate">{review.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
