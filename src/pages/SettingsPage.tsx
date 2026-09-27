import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Key, Sliders, Shield, Check, ExternalLink, Play, PanelRight } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { NovaIntro } from '../components/ui/NovaIntro';
import { useSettings } from '../context/SettingsContext';

export const SettingsPage: React.FC = () => {
  const { setIsSettingsOpen } = useSettings();
  const [adultContent, setAdultContent] = useState(false);
  const [highQualityPosters, setHighQualityPosters] = useState(true);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(() => {
    try {
      return localStorage.getItem('novaplay_autoplay_next') === 'true';
    } catch {
      return false;
    }
  });
  const [savedMessage, setSavedMessage] = useState(false);
  const [showIntroPreview, setShowIntroPreview] = useState(false);

  const isLive = tmdbService.isConfigured();

  const handleSave = () => {
    try {
      localStorage.setItem('novaplay_autoplay_next', String(autoPlayNext));
    } catch {
      // Ignore
    }
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleReplayIntro = () => {
    try {
      sessionStorage.removeItem('novaplay_intro_seen');
    } catch {
      // ignore
    }
    setShowIntroPreview(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16"
    >
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[var(--nova-accent)]">
              <Settings className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Preferences</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your discovery preferences, data providers, and viewing configuration.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          data-cursor="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--nova-accent)] text-zinc-950 text-xs font-semibold shadow-md hover:opacity-95 transition-all self-start sm:self-auto"
        >
          <PanelRight className="w-4 h-4" />
          <span>Open Settings Drawer</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* TMDB API Integration Card */}
        <div className="p-6 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[var(--nova-accent)]">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">
                  The Movie Database (TMDB) Connection
                </h2>
                <p className="text-xs text-zinc-400">
                  Global catalog provider for metadata, posters, and cast information.
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isLive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-[var(--nova-accent)]/10 text-[var(--nova-accent)] border border-[var(--nova-accent)]/20'
              }`}
            >
              {isLive ? 'Active (Live API)' : 'Architectural Fallback'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.05] text-xs text-zinc-400 space-y-2">
            <p>
              To attach your own TMDB API key, create a <code className="text-zinc-200 font-mono bg-white/[0.08] px-1.5 py-0.5 rounded">.env</code> file in the project root:
            </p>
            <div className="bg-[#08090C] p-3 rounded-lg font-mono text-zinc-300 text-xs overflow-x-auto border border-white/[0.04]">
              VITE_TMDB_API_KEY=your_v3_api_key_here<br />
              VITE_TMDB_ACCESS_TOKEN=your_optional_v4_bearer_token
            </div>
            <p className="text-[11px] text-zinc-500">
              API credentials are never exposed in public repositories or hardcoded into application source files.
            </p>
          </div>

          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--nova-accent)] hover:underline"
          >
            <span>Obtain free TMDB API key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Discovery & Interface Controls */}
        <div className="p-6 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Display & Content Preferences
              </h2>
              <p className="text-xs text-zinc-400">
                Tailor the catalog presentation to your viewing environment.
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">High-Resolution Post-Processing</p>
                <p className="text-xs text-zinc-400">Request original quality backdrops on supported displays</p>
              </div>
              <input
                type="checkbox"
                checked={highQualityPosters}
                onChange={(e) => setHighQualityPosters(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--nova-accent)] focus:ring-[var(--nova-accent)] bg-zinc-800 border-zinc-600"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Content Advisory Filter</p>
                <p className="text-xs text-zinc-400">Filter adult-rated catalog entries from discovery rows</p>
              </div>
              <input
                type="checkbox"
                checked={adultContent}
                onChange={(e) => setAdultContent(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--nova-accent)] focus:ring-[var(--nova-accent)] bg-zinc-800 border-zinc-600"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Autoplay Next Episode</p>
                <p className="text-xs text-zinc-400">Automatically advance and begin the subsequent episode in series</p>
              </div>
              <input
                type="checkbox"
                checked={autoPlayNext}
                onChange={(e) => setAutoPlayNext(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--nova-accent)] focus:ring-[var(--nova-accent)] bg-zinc-800 border-zinc-600"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Startup Cinematic Experience</p>
                <p className="text-xs text-zinc-400">Replay the full-screen cinematic logo entrance</p>
              </div>
              <button
                type="button"
                data-cursor="button"
                onClick={handleReplayIntro}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white border border-white/10 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[var(--nova-accent)]" />
                <span>Replay Intro</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors shadow-md flex items-center gap-1.5"
            >
              {savedMessage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Preferences Saved</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </div>

        {/* Platform Architecture Information */}
        <div className="p-6 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                About NovaPlay Architecture
              </h2>
              <p className="text-xs text-zinc-400">
                Phase 1 Foundation • Production-grade React & TypeScript Architecture
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed pt-2">
            NovaPlay is designed from the ground up for modularity. Future development phases will introduce personal account synchronization, custom user watchlists, multi-provider video embeds, and AI-driven personalized recommendations.
          </p>

          <div className="pt-3 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-gradient-to-r from-[#01b4e4] to-[#90cea1] text-zinc-950 font-black text-[11px] tracking-tight">
                TMDB
              </span>
              <span className="text-xs text-zinc-300 font-medium">Attribution Requirement</span>
            </div>
            <p className="text-xs text-zinc-400 italic">
              "This product uses the TMDB API but is not endorsed or certified by TMDB."
            </p>
          </div>
        </div>
      </div>

      {showIntroPreview && (
        <NovaIntro
          forceShow
          onComplete={() => setShowIntroPreview(false)}
        />
      )}
    </motion.div>
  );
};
