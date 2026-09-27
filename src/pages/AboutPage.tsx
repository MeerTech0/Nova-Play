import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Shield,
  Film,
  Sparkles,
  Heart,
  Code2,
  Mail,
  FileText,
  Lock,
} from 'lucide-react';
import { TmdbLogo } from '../components/common/TmdbLogo';
import { Logo } from '../components/common/Logo';

export const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'credits' | 'privacy' | 'terms' | 'contact'>('about');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 text-zinc-300"
    >
      {/* Page Header */}
      <div className="border-b border-white/[0.06] pb-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-zinc-400 max-w-xl mt-1">
            Discover the mission, technology, and attribution standards behind NovaPlay.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 p-1 rounded-2xl bg-[#111319] border border-white/[0.06]">
          {(
            [
              { id: 'about', label: 'About', icon: Sparkles },
              { id: 'credits', label: 'Credits & TMDB', icon: Film },
              { id: 'privacy', label: 'Privacy', icon: Lock },
              { id: 'terms', label: 'Terms', icon: FileText },
              { id: 'contact', label: 'Contact', icon: Mail },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                data-cursor="button"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[var(--nova-accent)] text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. ABOUT NOVAPLAY */}
      {activeTab === 'about' && (
        <div className="space-y-8">
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#12141C] to-[#0A0C10] border border-white/[0.08] relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--nova-accent)]/15 border border-[var(--nova-accent)]/30 text-[var(--nova-accent)] text-xs font-semibold uppercase tracking-wider">
                <Film className="w-3.5 h-3.5" />
                <span>The Vision</span>
              </span>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
                About NovaPlay
              </h1>

              <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-normal">
                NovaPlay is a modern movie and TV discovery experience designed to make exploring entertainment simple, cinematic and enjoyable.
              </p>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                The platform focuses on discovering movies and series, exploring detailed information, discovering cast and related titles, and providing a clean personalized viewing interface.
              </p>
            </div>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[var(--nova-accent)] mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white">Cinematic Discovery</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Browse curated collections, box office phenomena, and trending television in a high-fidelity dark aesthetic with zero clutter.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[var(--nova-accent)] mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white">Deep Context & Cast</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Access verified theatrical release dates, cast characters, principal directors, age certifications, and localized trailers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[var(--nova-accent)] mb-3">
                <Code2 className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white">Extensible Architecture</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Engineered with modular video providers, responsive layouts, customizable themes, and strict rate-limited API caching.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CREDITS & TMDB ATTRIBUTION */}
      {activeTab === 'credits' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#111319] border border-white/[0.08] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Data Attribution & Credits
                </h2>
                <p className="text-xs text-zinc-400">
                  Transparency and third-party data licensing disclosures.
                </p>
              </div>

              {/* Official TMDB Logo Button */}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all self-start sm:self-auto group"
                aria-label="Visit The Movie Database (TMDB)"
              >
                <TmdbLogo className="h-5" variant="full" />
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Official Attribution Statement */}
            <div className="p-5 rounded-2xl bg-black/50 border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#01b4e4]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Mandatory TMDB Disclosure
                </span>
              </div>

              <blockquote className="text-base sm:text-lg font-serif italic text-zinc-200 border-l-2 border-[#01b4e4] pl-4 py-1">
                "This product uses the TMDB API but is not endorsed or certified by TMDB."
              </blockquote>

              <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                NovaPlay utilizes metadata, backdrops, posters, and cast listings provided by{' '}
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#01b4e4] hover:underline font-medium"
                >
                  The Movie Database (TMDB)
                </a>
                . NovaPlay is an independent discovery platform and does not claim to be owned, sponsored, affiliated with, or endorsed by TMDB.
              </p>
            </div>

            {/* Open Source Software Credits */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                Open Source & Framework Technologies
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="font-semibold text-white">React 18</p>
                  <p className="text-zinc-500 text-[11px]">User Interface Library</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="font-semibold text-white">TypeScript</p>
                  <p className="text-zinc-500 text-[11px]">Strict Type Safety</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="font-semibold text-white">Framer Motion</p>
                  <p className="text-zinc-500 text-[11px]">Cinematic Animations</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="font-semibold text-white">Tailwind CSS</p>
                  <p className="text-zinc-500 text-[11px]">Design System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRIVACY POLICY */}
      {activeTab === 'privacy' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111319] border border-white/[0.08] space-y-5">
          <div className="border-b border-white/[0.06] pb-4">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Privacy Policy</h2>
            <p className="text-xs text-zinc-400">Last updated: September 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Your privacy is paramount. NovaPlay operates as a client-side discovery client. We do not sell, rent, or monetize your personal viewing activities or search histories.
            </p>
            <h3 className="text-white font-semibold pt-2">Local Storage & Preferences</h3>
            <p>
              All user preferences—including theme customization, accent selection, watchlist items, and playback positions—are stored strictly on your local device via standard browser <code className="text-zinc-200 font-mono bg-white/[0.06] px-1.5 py-0.5 rounded">localStorage</code>.
            </p>
            <h3 className="text-white font-semibold pt-2">Network Requests</h3>
            <p>
              When browsing the catalog, API requests are made directly to the TMDB API servers to retrieve posters and metadata. No personally identifiable tracking parameters are appended.
            </p>
          </div>
        </div>
      )}

      {/* 4. TERMS OF USE */}
      {activeTab === 'terms' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111319] border border-white/[0.08] space-y-5">
          <div className="border-b border-white/[0.06] pb-4">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Terms of Service</h2>
            <p className="text-xs text-zinc-400">Guidelines for platform use</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              By accessing NovaPlay, you agree to comply with standard acceptable use guidelines. NovaPlay is intended strictly for personal discovery and informational exploration of cinematic media.
            </p>
            <h3 className="text-white font-semibold pt-2">Intellectual Property</h3>
            <p>
              All movie posters, backdrops, character names, and title trademarks remain the exclusive intellectual property of their respective studios, distributors, and copyright holders.
            </p>
            <h3 className="text-white font-semibold pt-2">Service Availability</h3>
            <p>
              NovaPlay provides metadata as-is based on live TMDB API availability and client-side network connectivity.
            </p>
          </div>
        </div>
      )}

      {/* 5. CONTACT */}
      {activeTab === 'contact' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111319] border border-white/[0.08] space-y-5">
          <div className="border-b border-white/[0.06] pb-4">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Contact & Support</h2>
            <p className="text-xs text-zinc-400">Get in touch with the NovaPlay team</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Have feedback, architecture inquiries, or feature suggestions for NovaPlay? We welcome developer collaboration and community ideas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <p className="text-xs font-semibold text-white">Community Inquiries</p>
                <p className="text-xs text-[var(--nova-accent)] font-mono">contact@novaplay.app</p>
                <p className="text-[11px] text-zinc-500">General questions and discovery feedback</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <p className="text-xs font-semibold text-white">Security & Attribution</p>
                <p className="text-xs text-[var(--nova-accent)] font-mono">compliance@novaplay.app</p>
                <p className="text-[11px] text-zinc-500">Licensing and API attribution queries</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
