# Contributing Guide

Thanks for your interest in improving 2048 Game! This guide keeps contributions simple and consistent.

## Ways to Contribute
- Open issues (bugs, ideas, questions)
- Improve UI/UX (grid visuals, tile animations, accessibility, responsiveness)
- Add features (new game modes, larger grids, themes, touch controls, power-ups)
- Refactor/cleanup and small fixes
- Docs (README, comments, examples)

## Quick Start
```bash
git clone https://github.com/contrifest/two-zero-four-eight.git
cd two-zero-four-eight
npm install
npm run dev
```

Useful scripts:
```bash
npm run dev        # Start dev server (Vite + HMR)
npm run build      # Production build
npm run preview    # Preview build
npm run lint       # Check code quality
npm run format     # Format code
```

## Workflow
1. Fork the repo and create a feature branch:
   ```bash
   git checkout -b feat/short-description
   # or fix/short-description, docs/short-description
   ```
2. Make focused changes and commit with clear messages:
   - type(scope): short summary
   - Example: `feat(game): add 5x5 grid mode option`
3. Push your branch and open a Pull Request (PR).

## Coding Standards
- Vanilla JavaScript (ES6+) with Vite
- Prefer readable names, modular functions, early returns
- Keep comments only for non‑obvious game logic
- Modern CSS3 for styling grid and tile animations
- No unused variables/parameters (ESLint is strict)

### Project Conventions
- **Components**: React components under `src/components/`
- **Hooks**: Custom React hooks under `src/hooks/`
- **Types**: TypeScript type definitions under `src/types/`
- **Utils**: Helper functions and utilities under `src/utils/`
- **Context**: React context providers under `src/context/`
- **Styles**: CSS files under `src/` (index.css for global styles)
- **Main Entry**: `src/main.tsx` for React app initialization
- **App Component**: `src/App.tsx` as the root component

#### File Naming
- **Components**: PascalCase (e.g., `GameBoard.tsx`, `TileComponent.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGameState.ts`, `useLocalStorage.ts`)
- **Types**: PascalCase interfaces/types (e.g., `GameTypes.ts`, `TileTypes.ts`)
- **Utils**: camelCase (e.g., `gameLogic.ts`, `animations.ts`)
- **Context**: PascalCase with `Context` suffix (e.g., `GameContext.tsx`)

#### Code Organization
- One component per file with default export
- Group related types in single files under `types/`
- Keep utility functions pure and testable
- Use custom hooks for stateful logic reuse
- Organize context providers by feature domain

## Game-Specific Guidelines
- **Grid Logic**: Keep tile movement and merge algorithms efficient
- **Animations**: Maintain smooth 60fps performance for tile transitions
- **Touch Controls**: Ensure swipe gestures work on all mobile devices
- **Score System**: Maintain compatibility with localStorage persistence
- **Responsive Design**: Test on various screen sizes (mobile, tablet, desktop)

## PR Checklist
- [ ] Runs locally: `npm run dev`
- [ ] Lints clean: `npm run lint`
- [ ] Game mechanics work correctly (movement, merging, scoring)
- [ ] Touch/swipe controls tested on mobile
- [ ] No unrelated file changes
- [ ] Screenshots/GIFs for visual changes (optional but helpful)
- [ ] Description explains the why + what

## Testing Your Changes
Before submitting, please test:
- All four directional movements (↑ ↓ ← →)
- Tile merging logic (2+2=4, 4+4=8, etc.)
- Win condition (reaching 2048)
- Game over condition (grid full, no moves)
- Score calculation and best score persistence
- Undo functionality (if applicable)
- Mobile touch/swipe gestures

## Reporting Issues
Please include:
- What happened vs. expected behavior
- Steps to reproduce (specific moves/actions in game)
- Environment (OS, browser, screen size)
- Screenshots/GIFs if visual
- Current score/game state when issue occurred

## Feature Ideas
Looking for inspiration? Consider:
- **Game Modes**: 3x3, 5x5, 6x6 grids
- **Themes**: Dark mode, color schemes, seasonal themes
- **Power-ups**: Bomb tiles, shuffle board, extra undo
- **Animations**: Particle effects, tile flip animations
- **Accessibility**: Keyboard navigation, screen reader support
- **Statistics**: Games played, average score, time tracking



Thanks again for helping make 2048 Game better!
