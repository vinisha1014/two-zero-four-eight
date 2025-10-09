# 2048 — React + TypeScript

A polished, mobile-friendly 2048 game built with React, TypeScript and Tailwind CSS. Use the arrow keys/WASD (or swipe on touch devices) to slide tiles, merge equal numbers, and try to reach 2048.

[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4.svg)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Features

- **Smooth tile movement/merge** with basic animations
- **Keyboard + Touch controls**: Arrow keys, WASD, and swipe
- **Undo last move** with bounded history
- **Score + Best score** (best score persisted in `localStorage`)
- **Game Over / Win overlay** with restart/continue
- **Clean UI** using Tailwind CSS

## 🛠️ Tech Stack

- React 18, TypeScript
- Vite for dev/build, Tailwind CSS for styling
- Lucide Icons

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

## 🚀 Quick Start

```bash
git clone https://github.com/debugfest/two-zero-four-eight.git
cd two-zero-four-eight

# install deps
npm install

# start dev server
npm run dev

# open the URL from the terminal (usually http://localhost:5173)
```

## 📁 Project Structure

```
2048/
├── index.html
├── package.json
├── src/
│   ├── App.tsx                # Main UI
│   ├── components/            # Grid, Tile, Overlay, etc.
│   ├── context/               # Game state (Reducer + Provider)
│   ├── hooks/                 # Input (keyboard/touch)
│   ├── types/                 # Game types
│   ├── utils/                 # Game logic (movement/merge/checks)
│   ├── index.css              # Tailwind + animations
│   └── main.tsx               # Entry
├── tailwind.config.js
├── tsconfig*.json
└── vite.config.ts
```

## 🎮 How to Play

### Controls
- Arrow keys or WASD to move tiles
- Swipe on mobile/touch devices

### Rules
1. All tiles slide in the chosen direction.
2. Adjacent tiles of the same value merge into one (value doubles).
3. After each successful move, a new tile (2 or 4) appears.
4. The game ends when no moves are possible.
5. Create a 2048 tile to win; you may continue playing to chase a higher score.

## 🔧 Scripts

```bash
npm run dev        # Start development server with HMR
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Lint with ESLint
npm run typecheck  # TS project type check
```

## 📝 Notes for Contributors

Potential enhancements live in the app (theme switcher, leaderboard via Supabase, AI auto-player, richer animations, sounds, larger grids, achievements). PRs are welcome!

## 📄 License

MIT — see [LICENSE](LICENSE).
