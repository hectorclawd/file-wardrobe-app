# Filé

A shared wardrobe organizer with a high-end editorial aesthetic. Supports multiple user profiles, each with their own closet, outfit collection, and style inspiration board.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS (custom design system with CSS custom properties)
- Framer Motion (animations)
- Zustand (state, persisted to localStorage)
- React Router v6
- Lucide React (icons)
- Google Fonts: Cormorant Garamond + DM Sans

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```

## Features

- **Multi-profile** — Up to 4 profiles, each with a unique accent color
- **Closet** — Add clothing pieces with photos, category, occasion, and color tags
- **Outfits** — Save and manage outfit collections
- **AI Generate** — Rule-based outfit generator with occasion selector and inspo-driven suggestions
- **Inspiration** — Upload style reference photos with notes
- **Mobile-first** — Bottom navigation bar on mobile, sidebar on desktop
- **Persistent** — All data stored in localStorage

## Image Storage

Photos are compressed client-side (max 600×800 at JPEG 0.75) before storing as base64 in localStorage. localStorage has a ~5MB limit; adding many high-res photos may approach this.
