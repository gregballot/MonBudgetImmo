# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript mortgage calculator application called "Mon Budget Immo" - a French real estate budget simulator. The app helps users calculate mortgage payments, required salary, and affordable property prices based on French lending regulations (HCSF guidelines with 33% debt ratio).

## Tech Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: SCSS with CSS modules pattern
- **Routing**: React Router DOM 7.7.1
- **SEO**: React Helmet Async 2.0.5
- **Testing**: Jest 30.0.5 with ts-jest
- **Linting**: ESLint 9.30.1
- **Package Manager**: pnpm (has pnpm-lock.yaml)

## Development Commands

```bash
# Start development server (runs on port 3000)
pnpm dev

# Build for production
pnpm build

# Run linter
pnpm lint

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Preview production build
pnpm preview
```

## Architecture

### Core Application Structure

The app follows a standard React architecture with clear separation of concerns:

- **Views**: Three main pages - Simulator (main calculator), About, and NotFound
- **Components**: Modular UI components with co-located SCSS files
- **Contexts**: Theme management (dark/light mode with system preference detection)
- **Hooks**: Custom hooks for state persistence, debouncing, calculator animations, and theme management
- **Helpers**: Core business logic including the `MortgageCalculator` class

### Key Components

1. **Calculator Component** (`src/components/Calculator/`):
   - Main calculator interface with tabbed navigation
   - Three calculation modes: property price, monthly payment, or salary-based
   - Advanced mode with debt ratio, existing loans, and rental income considerations
   - Real-time validation and animated results

2. **MortgageCalculator Class** (`src/helpers/Calculator.ts`):
   - Core business logic for French mortgage calculations
   - Handles 3 calculation modes: `property`, `monthly`, `salary`
   - Implements French notary fees (7.5% of property price)
   - Calculates debt ratios considering rental income and existing loans

3. **Theme System**:
   - Context-based theme management with localStorage persistence
   - Automatic system theme detection and fallback
   - CSS custom properties for theming

### State Management Patterns

- **Centralized State**: `useCalculatorState` with reducer pattern for complex state management
- **Persistent State**: `usePersistentCalculatorState` hook combining state management with localStorage
- **Theme State**: Context-based with system preference integration
- **Validation**: Separate validation system with field-specific and cross-field validation

### Testing Strategy

- Jest configuration with ts-jest for TypeScript support
- Tests located in `__tests__` directories
- Coverage collection from `src/**/*.ts` files
- Example: `src/helpers/__tests__/Calculator.test.ts`

### Build Configuration

- **Vite**: Configured with React plugin, source maps enabled
- **Path Aliases**: `@styles` alias for styles directory
- **Bundle Optimization**: Manual chunking for vendor libraries
- **SEO Optimization**: Server configuration for proper routing

### French Business Logic

The calculator implements French real estate regulations:
- Maximum debt ratio: 33% (configurable in advanced mode)
- Notary fees: 7.5% of property price for existing properties
- Rental income: Only 70% considered for debt calculations
- Net-to-gross salary conversion: Assumes ~25% tax/social charges

## File Organization

```
src/
├── components/          # Reusable UI components
│   ├── Calculator/      # Calculator components (Form, Results, Inputs, Controls)  
│   ├── UI/             # Generic UI components (Button, Input, Slider, Tabs)
│   └── Layout/         # Header, Footer, Layout structure
├── constants/          # Application constants and configuration
├── contexts/           # React contexts (Theme)
├── helpers/            # Business logic and utilities
├── hooks/              # Custom React hooks (state management, persistence, animation)
├── types/              # TypeScript type definitions (calculator, global)
├── utils/              # Utility functions (validation, calculations)
├── views/              # Page components
└── styles/             # Global SCSS files
```

## Important Notes

- All monetary calculations maintain precision using proper rounding
- Form validation is real-time and contextual to the active calculation mode
- Component styling follows SCSS modules pattern with `.scss` files co-located
- SEO is handled per-page with React Helmet Async
- The app is deployed on Vercel (has vercel.json config)