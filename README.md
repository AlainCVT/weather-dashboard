# Weather Dashboard

Weather Dashboard is a modern web application for viewing weather conditions and forecasts in a clean, responsive interface.

## Overview

- Built with React, TypeScript, and Vite.
- Displays current weather, hourly forecast, and daily forecast.
- Includes an interactive map with multiple map styles.
- Shows additional information such as air pollution data.
- Provides a light/dark theme and responsive layout.

## Features

- City search and selection.
- Current weather and forecast display.
- Interactive map to locate the weather region.
- Air pollution statistics.
- Reusable UI components and modern design.

## Technologies

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Leaflet / react-leaflet
- Zustand
- @tanstack/react-query
- Zod
- Vitest + Testing Library

## Installation

```bash
pnpm install
```

## Run locally

```bash
pnpm dev
```

Then open `http://localhost:5173` to view the app.

## Production build

```bash
pnpm build
pnpm preview
```

## Tests

```bash
pnpm test
pnpm test:ui
```

## Project structure

- `src/`: main source code
- `src/components/`: reusable UI components
- `src/sections/`: weather sections and display components
- `src/contexts/`: theme and side panel state management
- `src/hooks/`: custom hooks
- `src/schemas/`: data validation schemas
- `src/tests/`: unit and integration tests

## Notes

- The project uses `@maptiler/leaflet-maptilersdk` for mapping.
- Weather data is fetched from an external API in `src/api.ts`.
- ESLint and Prettier configuration is included.

## Contribution

1. Create a branch from `main`.
2. Make your changes.
3. Open a pull request.

Enjoy exploring the weather dashboard!
