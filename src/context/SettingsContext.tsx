import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeOption = 'dark' | 'amoled' | 'dim' | 'system';
export type AccentOption = 'nova' | 'blue' | 'purple' | 'red' | 'green';
export type CardSizeOption = 'compact' | 'comfortable' | 'large';
export type AnimationOption = 'full' | 'reduced' | 'off';
export type CursorOption = 'nova' | 'minimal' | 'system';
export type QualityOption = 'auto' | '1080p' | '720p' | '480p';
export type GridDensityOption = 'dense' | 'normal' | 'relaxed';
export type HeroHeightOption = 'compact' | 'standard' | 'tall';

export interface NovaSettings {
  // Appearance
  theme: ThemeOption;
  accent: AccentOption;

  // Interface & Layout
  cardSize: CardSizeOption;
  gridDensity: GridDensityOption;
  heroHeight: HeroHeightOption;

  // Animation & Cursor
  animation: AnimationOption;
  cursor: CursorOption;
  reduceMotion: boolean;

  // Playback
  autoPlayNext: boolean;
  rememberPosition: boolean;
  defaultQuality: QualityOption;
  defaultSubtitle: string;
  defaultAudio: string;

  // Content
  showRatings: boolean;
  showYears: boolean;
  showDescriptions: boolean;
}

export const DEFAULT_SETTINGS: NovaSettings = {
  theme: 'dark',
  accent: 'nova',
  cardSize: 'comfortable',
  gridDensity: 'normal',
  heroHeight: 'standard',
  animation: 'full',
  cursor: 'nova',
  reduceMotion: false,
  autoPlayNext: false,
  rememberPosition: true,
  defaultQuality: 'auto',
  defaultSubtitle: 'off',
  defaultAudio: 'orig',
  showRatings: true,
  showYears: true,
  showDescriptions: true,
};

export const ACCENT_PALETTES: Record<
  AccentOption,
  { label: string; hex: string; rgb: string; hover: string }
> = {
  nova: { label: 'Nova Gold', hex: '#E5A93C', rgb: '229, 169, 60', hover: '#F0BA5A' },
  blue: { label: 'Cyan Blue', hex: '#3B82F6', rgb: '59, 130, 246', hover: '#60A5FA' },
  purple: { label: 'Astral Purple', hex: '#8B5CF6', rgb: '139, 92, 246', hover: '#A78BFA' },
  red: { label: 'Crimson Red', hex: '#EF4444', rgb: '239, 68, 68', hover: '#F87171' },
  green: { label: 'Emerald Green', hex: '#10B981', rgb: '16, 185, 129', hover: '#34D399' },
};

export const THEME_CONFIGS: Record<
  ThemeOption,
  { label: string; bg: string; surface: string; card: string; cardHover: string }
> = {
  dark: {
    label: 'Dark Cinematic',
    bg: '#08090C',
    surface: '#111319',
    card: '#161922',
    cardHover: '#1B1F2B',
  },
  amoled: {
    label: 'AMOLED Black',
    bg: '#000000',
    surface: '#0A0A0A',
    card: '#111111',
    cardHover: '#171717',
  },
  dim: {
    label: 'Dim Slate',
    bg: '#0E1117',
    surface: '#161B22',
    card: '#1F242C',
    cardHover: '#262C36',
  },
  system: {
    label: 'System Dark',
    bg: '#08090C',
    surface: '#111319',
    card: '#161922',
    cardHover: '#1B1F2B',
  },
};

const STORAGE_KEY = 'novaplay_settings';

interface SettingsContextType {
  settings: NovaSettings;
  updateSetting: <K extends keyof NovaSettings>(key: K, value: NovaSettings[K]) => void;
  resetSettings: () => void;
  clearLocalPreferences: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  toggleSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NovaSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  // Update a single setting and persist
  const updateSetting = useCallback(
    <K extends keyof NovaSettings>(key: K, value: NovaSettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          // If autoPlayNext is changed, also sync with legacy key
          if (key === 'autoPlayNext') {
            localStorage.setItem('novaplay_autoplay_next', String(value));
          }
        } catch (e) {
          console.warn('Failed to save settings:', e);
        }
        return next;
      });
    },
    []
  );

  // Reset to default settings
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem('novaplay_autoplay_next', 'false');
    } catch {
      // Ignore
    }
  }, []);

  // Clear all local preferences & history
  const clearLocalPreferences = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('novaplay_watchlist');
      localStorage.removeItem('novaplay_episode_progress');
      localStorage.removeItem('novaplay_autoplay_next');
      sessionStorage.removeItem('novaplay_intro_seen');
    } catch {
      // Ignore
    }
    setSettings(DEFAULT_SETTINGS);
  }, []);

  // Apply CSS Variables globally to document.documentElement
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const accent = ACCENT_PALETTES[settings.accent] || ACCENT_PALETTES.nova;
    const theme = THEME_CONFIGS[settings.theme] || THEME_CONFIGS.dark;

    // Apply Accent CSS Variables
    root.style.setProperty('--nova-accent', accent.hex);
    root.style.setProperty('--nova-accent-rgb', accent.rgb);
    root.style.setProperty('--nova-accent-hover', accent.hover);

    // Apply Theme Colors
    root.style.setProperty('--nova-bg', theme.bg);
    root.style.setProperty('--nova-surface', theme.surface);
    root.style.setProperty('--nova-card', theme.card);
    root.style.setProperty('--nova-card-hover', theme.cardHover);

    // Set document background color
    document.body.style.backgroundColor = theme.bg;

    // Apply animation / motion modes
    if (settings.animation === 'off' || settings.reduceMotion) {
      root.classList.add('reduce-motion');
      root.style.setProperty('--motion-duration', '0s');
    } else {
      root.classList.remove('reduce-motion');
      root.style.removeProperty('--motion-duration');
    }

    // Apply theme data attribute
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-accent', settings.accent);
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        clearLocalPreferences,
        isSettingsOpen,
        setIsSettingsOpen,
        toggleSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
