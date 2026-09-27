import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface SectionProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
  layout?: 'carousel' | 'grid';
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  action,
  layout = 'carousel',
  children,
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 20);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
    }
  };

  useEffect(() => {
    if (layout === 'carousel') {
      checkScroll();
      const el = scrollContainerRef.current;
      if (el) {
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);
        return () => {
          el.removeEventListener('scroll', checkScroll);
          window.removeEventListener('resize', checkScroll);
        };
      }
    }
  }, [layout, children]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollDistance = el.clientWidth * 0.75;
      el.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`py-8 sm:py-10 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[var(--nova-accent)]" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 pl-3.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll Navigation Controls for carousel */}
            {layout === 'carousel' && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  data-cursor="button"
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  aria-label={`Scroll ${title} left`}
                  className={`p-2 rounded-full border border-white/10 transition-all ${
                    canScrollLeft
                      ? 'bg-white/[0.05] text-white hover:bg-white/[0.1] active:scale-95'
                      : 'text-zinc-600 bg-transparent border-white/[0.03] cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  data-cursor="button"
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  aria-label={`Scroll ${title} right`}
                  className={`p-2 rounded-full border border-white/10 transition-all ${
                    canScrollRight
                      ? 'bg-white/[0.05] text-white hover:bg-white/[0.1] active:scale-95'
                      : 'text-zinc-600 bg-transparent border-white/[0.03] cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Action Link (e.g. See All) */}
            {action && (
              <Link
                to={action.href}
                data-cursor="hover"
                className="group inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-zinc-400 hover:text-[var(--nova-accent)] transition-colors py-1 px-2.5 rounded-lg hover:bg-white/[0.04]"
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Content Container */}
        {layout === 'carousel' ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-none scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {children}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {children}
          </div>
        )}
      </div>
    </motion.section>
  );
};
