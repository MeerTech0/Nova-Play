import React from 'react';

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="flex-none w-[170px] sm:w-[200px] md:w-[220px] rounded-2xl bg-[#111319] border border-white/[0.04] p-2 overflow-hidden animate-pulse">
      {/* Poster shimmer */}
      <div className="aspect-[2/3] w-full rounded-xl bg-white/[0.05]" />
      {/* Title & metadata shimmer */}
      <div className="p-2 space-y-2.5">
        <div className="h-3.5 w-4/5 rounded bg-white/[0.07]" />
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-1/3 rounded bg-white/[0.04]" />
          <div className="h-2.5 w-1/4 rounded bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
};

export const SectionSkeleton: React.FC<{ count?: number; titleWidth?: string }> = ({
  count = 5,
  titleWidth = 'w-48',
}) => {
  return (
    <div className="py-8 sm:py-10 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-4 rounded-full bg-[var(--nova-accent)]/40" />
          <div className={`h-6 ${titleWidth} rounded-md bg-white/[0.06]`} />
        </div>
        <div className="flex gap-4 sm:gap-5 overflow-hidden">
          {Array.from({ length: count }).map((_, i) => (
            <MovieCardSkeleton key={`skeleton-card-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] min-h-[500px] max-h-[820px] bg-[#0A0C10] overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/50 to-transparent" />
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
        <div className="max-w-xl space-y-4">
          <div className="h-6 w-36 rounded-full bg-white/[0.08]" />
          <div className="h-10 sm:h-14 w-3/4 rounded-xl bg-white/[0.1]" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-white/[0.06]" />
            <div className="h-4 w-5/6 rounded bg-white/[0.06]" />
            <div className="h-4 w-2/3 rounded bg-white/[0.06]" />
          </div>
          <div className="flex gap-4 pt-3">
            <div className="h-12 w-36 rounded-xl bg-white/[0.12]" />
            <div className="h-12 w-32 rounded-xl bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </div>
  );
};
