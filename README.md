# Mon Simulateur Immo

[![CI](https://github.com/gregballot/MonBudgetImmo/workflows/CI/badge.svg)](https://github.com/gregballot/MonBudgetImmo/actions)
[![Build Status](https://img.shields.io/github/actions/workflow/status/gregballot/MonBudgetImmo/ci.yml?branch=master&label=build)](https://github.com/gregballot/MonBudgetImmo/actions)
[![Tests](https://img.shields.io/github/actions/workflow/status/gregballot/MonBudgetImmo/ci.yml?branch=master&label=tests)](https://github.com/gregballot/MonBudgetImmo/actions)
[![Vercel](https://vercelbadge.vercel.app/api/gregballot/MonBudgetImmo)](https://vercel.com)
[![Version](https://img.shields.io/github/package-json/v/gregballot/MonBudgetImmo?filename=app%2Fpackage.json)](https://github.com/gregballot/MonBudgetImmo)

Mon Simulateur Immo is a project aiming to help anyone with a real estate project have a clear view of its financial aspect.
This application provides tools and simulations to make property budgeting simple, transparent, and accessible for all.

## Setup & Run

1. **Install dependencies**

   From the `app` directory:
   ```sh
   pnpm install
   ```

2. **Start the development server**

   ```sh
   pnpm run dev
   ```

3. **Open your browser**

   Visit [http://localhost:5173](http://localhost:3000) to view the app.

## Development & Testing

### Running Tests
```sh
# Run tests once
pnpm run test

# Run tests in watch mode  
pnpm run test:watch

# Run tests with CI configuration
pnpm run test:ci
```

### Linting
```sh
pnpm run lint
```

### Building
```sh
# Build with tests and linting (production ready)
pnpm run build

# Build only (CI environment)
pnpm run build:ci
```

## Deployment

The application automatically deploys to Vercel on every push to the master branch. The CI/CD pipeline includes:

- **Automated testing** - All tests must pass before deployment
- **Code linting** - ESLint validation for code quality
- **TypeScript compilation** - Type checking and compilation
- **Automatic versioning** - Version increments on each deployment

### Manual Deployment with Version Bump
```sh
# Deploy with tests, linting, and automatic patch version increment
pnpm run deploy

# Or manually increment version and push separately
pnpm run version:patch  # 1.0.5 -> 1.0.6
pnpm run version:minor  # 1.0.6 -> 1.1.0  
pnpm run version:major  # 1.1.0 -> 2.0.0
git add package.json && git commit -m "chore: bump version" && git push
```

### Git Hooks
- **Pre-commit hook**: Automatically runs tests and linting before each commit
- **Clean deployment**: No more git conflicts or amended commits
