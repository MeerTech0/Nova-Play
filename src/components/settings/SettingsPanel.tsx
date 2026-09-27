import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Palette,
  Sliders,
  PlaySquare,
  Sparkles,
  MousePointer,
  RotateCcw,
  Trash2,
  Check,
  Eye,
  Monitor,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import {
  useSettings,
  ThemeOption,
  AccentOption,
  CardSizeOption,
  AnimationOption,
  CursorOption,
  QualityOption,
  GridDensityOption,
  HeroHeightOption,
  ACCENT_PALETTES,
} from '../../context/SettingsContext';

export const SettingsPanel: React.FC = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    clearLocalPreferences,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<'appearance' | 'interface' | 'playback' | 'content'>('appearance');
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [clearConfirmed, setClearConfirmed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, setIsSettingsOpen]);

  // Lock body scroll when settings drawer is open
  useEffect(() => {
    if (isSettingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSettingsOpen]);

  const handleReset = () => {
    resetSettings();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 2000);
  };

  const handleClear = () => {
    clearLocalPreferences();
    setClearConfirmed(true);
    setTimeout(() => setClearConfirmed(false), 2000);
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[9995] overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsSettingsOpen(false)}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Drawer Panel: Right-side on desktop, full-screen on mobile */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen sm:max-w-xl h-full flex flex-col bg-[#0B0D13]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl text-white select-none"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--nova-accent)] shadow-sm" />
                    <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">
                      Settings & Preferences
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Live customization • Applied immediately across NovaPlay
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  data-cursor="button"
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--nova-accent)]"
                  aria-label="Close Settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Segmented Category Navigation */}
              <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-white/[0.06] flex gap-1.5 overflow-x-auto scrollbar-none">
                {(
                  [
                    { id: 'appearance', label: 'Appearance', icon: Palette },
                    { id: 'interface', label: 'Interface', icon: Sliders },
                    { id: 'playback', label: 'Playback', icon: PlaySquare },
                    { id: 'content', label: 'Content', icon: Eye },
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
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-[var(--nova-accent)] text-zinc-950 shadow-md'
                          : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Settings Content Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-7 custom-scrollbar">
                {/* 1. APPEARANCE TAB */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    {/* Theme Selector */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                        Theme Mode
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(
                          [
                            { id: 'dark', label: 'Dark Cinematic', desc: 'Obsidian charcoal', icon: Moon },
                            { id: 'amoled', label: 'AMOLED Dark', desc: 'True pure black', icon: Monitor },
                            { id: 'dim', label: 'Dim Slate', desc: 'Soft navy slate', icon: Sun },
                            { id: 'system', label: 'System Dark', desc: 'Match device', icon: Laptop },
                          ] as const
                        ).map((t) => {
                          const Icon = t.icon;
                          const isSelected = settings.theme === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => updateSetting('theme', t.id as ThemeOption)}
                              data-cursor="button"
                              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                                isSelected
                                  ? 'bg-white/[0.08] border-[var(--nova-accent)] shadow-md'
                                  : 'bg-[#111319] hover:bg-[#161922] border-white/[0.06]'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Icon className={`w-4 h-4 ${isSelected ? 'text-[var(--nova-accent)]' : 'text-zinc-400'}`} />
                                {isSelected && (
                                  <span className="w-4 h-4 rounded-full bg-[var(--nova-accent)] text-zinc-950 flex items-center justify-center text-[10px]">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-white">{t.label}</p>
                              <p className="text-[11px] text-zinc-400 mt-0.5">{t.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Accent Color Selector */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                        Accent Color
                      </label>
                      <div className="grid grid-cols-5 gap-2.5">
                        {(Object.keys(ACCENT_PALETTES) as AccentOption[]).map((accKey) => {
                          const pal = ACCENT_PALETTES[accKey];
                          const isSelected = settings.accent === accKey;
                          return (
                            <button
                              key={accKey}
                              type="button"
                              onClick={() => updateSetting('accent', accKey)}
                              data-cursor="button"
                              className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                                isSelected
                                  ? 'bg-white/[0.1] border-white/40 shadow-lg scale-102'
                                  : 'bg-[#111319] hover:bg-[#161922] border-white/[0.06]'
                              }`}
                            >
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center shadow-md mb-2"
                                style={{ backgroundColor: pal.hex }}
                              >
                                {isSelected && <Check className="w-4 h-4 text-zinc-950 stroke-[3]" />}
                              </span>
                              <span className="text-[11px] font-medium text-zinc-200 capitalize">
                                {accKey}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cursor Customization */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MousePointer className="w-4 h-4 text-[var(--nova-accent)]" />
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                          Desktop Mouse Cursor
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {(
                          [
                            { id: 'nova', label: 'Nova Cursor', desc: 'Dual-ring with lag' },
                            { id: 'minimal', label: 'Minimal Cursor', desc: 'Central dot only' },
                            { id: 'system', label: 'System Cursor', desc: 'Standard browser' },
                          ] as const
                        ).map((cur) => {
                          const isSelected = settings.cursor === cur.id;
                          return (
                            <button
                              key={cur.id}
                              type="button"
                              onClick={() => updateSetting('cursor', cur.id as CursorOption)}
                              data-cursor="button"
                              className={`p-3 rounded-2xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-white/[0.08] border-[var(--nova-accent)] shadow-md'
                                  : 'bg-[#111319] hover:bg-[#161922] border-white/[0.06]'
                              }`}
                            >
                              <p className="text-xs font-semibold text-white">{cur.label}</p>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{cur.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. INTERFACE & LAYOUT TAB */}
                {activeTab === 'interface' && (
                  <div className="space-y-6">
                    {/* Card Size Selector */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                        Movie Card Size
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {(
                          [
                            { id: 'compact', label: 'Compact', desc: 'High density' },
                            { id: 'comfortable', label: 'Comfortable', desc: 'Balanced default' },
                            { id: 'large', label: 'Large', desc: 'Prominent posters' },
                          ] as const
                        ).map((cs) => {
                          const isSelected = settings.cardSize === cs.id;
                          return (
                            <button
                              key={cs.id}
                              type="button"
                              onClick={() => updateSetting('cardSize', cs.id as CardSizeOption)}
                              data-cursor="button"
                              className={`p-3 rounded-2xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-white/[0.08] border-[var(--nova-accent)] shadow-md'
                                  : 'bg-[#111319] hover:bg-[#161922] border-white/[0.06]'
                              }`}
                            >
                              <p className="text-xs font-semibold text-white">{cs.label}</p>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{cs.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Grid Density */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                        Catalogue Grid Density
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {(
                          [
                            { id: 'dense', label: 'Dense' },
                            { id: 'normal', label: 'Normal' },
                            { id: 'relaxed', label: 'Relaxed' },
                          ] as const
                        ).map((gd) => {
                          const isSelected = settings.gridDensity === gd.id;
                          return (
                            <button
                              key={gd.id}
                              type="button"
                              onClick={() => updateSetting('gridDensity', gd.id as GridDensityOption)}
                              data-cursor="button"
                              className={`p-3 rounded-xl border text-center transition-all ${
                                isSelected
                                  ? 'bg-[var(--nova-accent)] text-zinc-950 font-semibold'
                                  : 'bg-[#111319] text-zinc-300 border-white/[0.06] hover:bg-[#161922]'
                              }`}
                            >
                              <span className="text-xs font-medium">{gd.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hero Height */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                        Featured Hero Banner Height
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {(
                          [
                            { id: 'compact', label: 'Compact (60vh)' },
                            { id: 'standard', label: 'Standard (75vh)' },
                            { id: 'tall', label: 'Immersive (85vh)' },
                          ] as const
                        ).map((hh) => {
                          const isSelected = settings.heroHeight === hh.id;
                          return (
                            <button
                              key={hh.id}
                              type="button"
                              onClick={() => updateSetting('heroHeight', hh.id as HeroHeightOption)}
                              data-cursor="button"
                              className={`p-3 rounded-xl border text-center transition-all ${
                                isSelected
                                  ? 'bg-[var(--nova-accent)] text-zinc-950 font-semibold'
                                  : 'bg-[#111319] text-zinc-300 border-white/[0.06] hover:bg-[#161922]'
                              }`}
                            >
                              <span className="text-xs font-medium">{hh.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Animation Speed & Motion */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-[var(--nova-accent)]" />
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                          UI Motion & Animations
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {(
                          [
                            { id: 'full', label: 'Full Motion', desc: 'Fluid transitions' },
                            { id: 'reduced', label: 'Reduced', desc: 'Subtle motion' },
                            { id: 'off', label: 'Instant (Off)', desc: 'Zero latency' },
                          ] as const
                        ).map((am) => {
                          const isSelected = settings.animation === am.id;
                          return (
                            <button
                              key={am.id}
                              type="button"
                              onClick={() => updateSetting('animation', am.id as AnimationOption)}
                              data-cursor="button"
                              className={`p-3 rounded-2xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-white/[0.08] border-[var(--nova-accent)] shadow-md'
                                  : 'bg-[#111319] hover:bg-[#161922] border-white/[0.06]'
                              }`}
                            >
                              <p className="text-xs font-semibold text-white">{am.label}</p>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{am.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. PLAYBACK TAB */}
                {activeTab === 'playback' && (
                  <div className="space-y-5">
                    {/* Autoplay & Position Toggles */}
                    <div className="divide-y divide-white/[0.06] p-4 rounded-2xl bg-[#111319] border border-white/[0.06]">
                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Autoplay Next Episode</p>
                          <p className="text-xs text-zinc-400">
                            Advance and stream subsequent episodes automatically
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.autoPlayNext}
                          onChange={(e) => updateSetting('autoPlayNext', e.target.checked)}
                          className="w-4 h-4 rounded text-[var(--nova-accent)] focus:ring-[var(--nova-accent)] bg-zinc-800 border-zinc-600"
                        />
                      </div>

                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Remember Playback Position</p>
                          <p className="text-xs text-zinc-400">
                            Resume films and series where you previously stopped
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.rememberPosition}
                          onChange={(e) => updateSetting('rememberPosition', e.target.checked)}
                          className="w-4 h-4 rounded text-[var(--nova-accent)] focus:ring-[var(--nova-accent)] bg-zinc-800 border-zinc-600"
                        />
                      </div>
                    </div>

                    {/* Default Quality */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                        Default Streaming Quality
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['auto', '1080p', '720p', '480p'] as QualityOption[]).map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => updateSetting('defaultQuality', q)}
                            data-cursor="button"
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              settings.defaultQuality === q
                                ? 'bg-[var(--nova-accent)] text-zinc-950 font-semibold'
                                : 'bg-[#111319] text-zinc-300 border-white/[0.06] hover:bg-[#161922]'
                            }`}
                          >
                            <span className="text-xs capitalize">{q}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Default Subtitles */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                        Default Subtitle Language
                      </label>
                      <select
                        value={settings.defaultSubtitle}
                        onChange={(e) => updateSetting('defaultSubtitle', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#111319] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[var(--nova-accent)]"
                      >
                        <option value="off">Subtitles Off</option>
                        <option value="en">English [CC]</option>
                        <option value="hi">Hindi</option>
                        <option value="ur">Urdu</option>
                        <option value="orig">Original Audio Subtitles</option>
                      </select>
                    </div>

                    {/* Default Audio */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                        Default Audio Language
                      </label>
                      <select
                        value={settings.defaultAudio}
                        onChange={(e) => updateSetting('defaultAudio', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#111319] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[var(--nova-accent)]"
                      >
                        <option value="orig">Original [Default]</option>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ur">Urdu</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 4. CONTENT VISIBILITY TAB */}
                {activeTab === 'content' && (
                  <div className="space-y-5">
                    <div className="divide-y divide-white/[0.06] p-4 rounded-2xl bg-[#111319] border border-white/[0.06]">
                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Show Community Ratings</p>
                          <p className="text-xs text-zinc-400">Display TMDB score stars on media cards</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.showRatings}
                          onChange={(e) => updateSetting('showRatings', e.target.checked)}
                          className="w-4 h-4 rounded text-[var(--nova-accent)] focus:ring-[var(--nova-accent)] bg-zinc-800 border-zinc-600"
                        />
                      </div>

                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Show Release Years</p>
                          <p className="text-xs text-zinc-400">Show theatrical release year on cards</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.showYears}
                          onChange={(e) => updateSetting('showYears', e.target.checked)}
                          className="w-4 h-4 rounded text-[var(--nova-accent)] focus:ring-[var(--nova-accent)] bg-zinc-800 border-zinc-600"
                        />
                      </div>

                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Show Card Descriptions</p>
                          <p className="text-xs text-zinc-400">Enable brief synopsis previews on hover</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.showDescriptions}
                          onChange={(e) => updateSetting('showDescriptions', e.target.checked)}
                          className="w-4 h-4 rounded text-[var(--nova-accent)] focus:ring-[var(--nova-accent)] bg-zinc-800 border-zinc-600"
                        />
                      </div>
                    </div>

                    {/* Reset & Wipe Section */}
                    <div className="pt-4 space-y-3">
                      <button
                        type="button"
                        onClick={handleReset}
                        data-cursor="button"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 text-xs font-semibold border border-white/10 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{resetConfirmed ? 'Settings Reset to Default' : 'Reset All Settings to Default'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClear}
                        data-cursor="button"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{clearConfirmed ? 'Local Cache & Watchlist Cleared' : 'Clear Local Cache & Watchlist'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0A0C10] flex items-center justify-between text-xs text-zinc-500">
                <span>NovaPlay v1.0 • Settings Engine</span>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-[var(--nova-accent)] text-zinc-950 font-semibold"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
