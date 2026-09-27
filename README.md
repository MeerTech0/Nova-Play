# NovaPlay — Premium Movie & TV Streaming Discovery Platform

NovaPlay is a modern, dark cinematic discovery interface engineered for discerning film and television enthusiasts. Built as a scalable, production-grade foundation ready for TMDB API integration and streaming provider extensions.

---

## Architecture & Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Tooling**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom cinematic dark palette, glassmorphism, and responsive spacing
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid entrance transitions, card hover elevation, section reveals, and cinematic startup sequence
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Upgraded Capabilities

### 1. Cinematic Startup Intro (`NovaIntro.tsx`)
- Full-screen obsidian backdrop (`#08090C`)
- Centered geometric emblem & `NOVAPLAY` wordmark
- Starts slightly blurred (`blur(14px)`) and eases into crisp focus with subtle scale
- A soft, thin light sweep passes across the logo
- Elegant fade out revealing the platform underneath (duration: ~2.2 seconds)
- **Session-Persisted**: Stored in `sessionStorage` (`novaplay_intro_seen`) so it only plays once per session and never interrupts route navigation
- **Accessible & Skippable**: Accessible "Skip Intro" button (plus `Escape` keyboard shortcut)
- **Replay Feature**: Available in the Settings menu (`/settings`) to preview on demand

### 2. Desktop Custom Cursor (`NovaCursor.tsx`)
- **Dual Element Design**: Snappy central dot (`#E5A93C`) paired with a softly eased outer ring
- **Spring Physics**: Trailing outer ring with subtle inertia and lag powered by Framer Motion springs
- **Zero React Re-render Lag**: Uses `useMotionValue` and direct DOM transforms for 60/120fps performance without triggering re-render cycles
- **State Adaptations**:
  - `default`: Minimal 30px amber ring and 5px dot
  - `hover`: Expanded 44px ring over navigation links
  - `button`: 48px filled highlight over buttons
  - `card`: 54px subtle white translucent ring over media cards
  - `text`: Transforms into slim vertical beam for text areas
- **Magnetic Pull**: Interactive buttons equipped with `data-magnetic="true"` gently pull the cursor towards the button center
- **Accessibility & Touch Safety**:
  - `pointer-events: none` ensures clicks and native text selection never get blocked
  - Automatically disabled on touchscreens, coarse pointers, and when `prefers-reduced-motion` is enabled

---

## Directory Structure

```text
src/
├── assets/             # Brand logos and static graphic assets
├── components/
│   ├── common/         # Logo, ScrollToTop, shared utility primitives
│   ├── feedback/       # GlobalLoading, CardSkeleton, GlobalError state components
│   ├── layout/         # Responsive Navbar, Section container, Footer
│   ├── media/          # HeroBanner, MovieCard, GenreCard
│   └── ui/             # NovaIntro (startup intro) & NovaCursor (custom cursor)
├── context/            # UIContext and global client state
├── data/               # Structured placeholder catalog adhering to TMDB interfaces
├── hooks/              # Reusable data hooks (useTrending, usePopularMovies, usePopularTV)
├── layouts/            # RootLayout with intro, cursor, fixed navbar, and footer
├── lib/                # Utility helpers (formatters, duration parsers, currency)
├── pages/
│   ├── HomePage.tsx            # Foundation Home (Hero, Trending, Movies, TV, Top Rated, Genres)
│   ├── MoviesPage.tsx          # Feature films catalogue with category filter tabs
│   ├── TVShowsPage.tsx         # Television series catalogue
│   ├── GenresPage.tsx          # Genre explorer & tone filtering
│   ├── SearchPage.tsx          # Real-time multi-search with query debouncing
│   ├── MediaDetailsPage.tsx    # Comprehensive title view (Cast, Crew, Synopsis, Similar)
│   ├── WatchPage.tsx           # Player stage foundation (Phase 1 preview placeholder)
│   ├── SettingsPage.tsx        # TMDB status, display preferences, and replay intro
│   └── NotFoundPage.tsx        # Cinematic 404 error screen
├── services/
│   └── tmdb.ts         # Central TMDB service layer (with automatic placeholder fallback)
├── styles/
│   └── index.css       # Tailwind directives, custom glassmorphism & dark scrollbars
├── types/
│   ├── index.ts        # Common application types
│   └── media.ts        # TypeScript interfaces: Movie, TVShow, CastMember, Genre, Video, MediaDetails
└── App.tsx             # Route declarations
```

---

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# TypeScript type check & build
npm run build
```
