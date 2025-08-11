# Development Guidelines - Mon Budget Immo

This document provides development guidelines and best practices for working with the Mon Budget Immo codebase.

## 🏗️ Architecture Principles

### Component Design
- **Single Responsibility**: Each component should have one clear purpose
- **Composition over Inheritance**: Use component composition patterns
- **Props Interface**: Keep prop interfaces focused and minimal (max 10-12 props)
- **Separation of Concerns**: Separate UI, business logic, and state management

### State Management
- **Centralized State**: Use custom hooks with reducers for complex state
- **Local State**: Keep simple UI state local to components
- **Derived State**: Calculate derived values instead of storing them
- **State Normalization**: Keep state flat and normalized

### Performance Guidelines
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` appropriately
- **Lazy Loading**: Split large components and load them lazily
- **Bundle Optimization**: Keep bundle size optimized with proper imports

## 📝 Code Quality Standards

### TypeScript
- **Strict Mode**: Always use strict TypeScript configuration
- **No Any**: Avoid `any` types - use proper typing or `unknown`
- **Type Guards**: Create type guards for runtime type checking
- **Interface Design**: Design interfaces that prevent invalid states

### Error Handling
- **Error Boundaries**: Implement error boundaries for component failures
- **Graceful Degradation**: Handle errors gracefully with fallbacks
- **User-Friendly Messages**: Provide clear, actionable error messages
- **Logging**: Log errors for debugging while protecting user privacy

### Testing Strategy
```
├── Unit Tests (Pure functions, utilities)
├── Component Tests (React Testing Library)
├── Integration Tests (User workflows)
└── E2E Tests (Critical user paths)
```

## 🎨 Styling Guidelines

### CSS Organization
- **Component-Scoped**: Keep styles close to components
- **Design System**: Use consistent spacing, colors, and typography
- **Responsive First**: Design for mobile-first responsive layout
- **Performance**: Minimize CSS bundle size and avoid unused styles

### File Structure
```
src/
├── components/
│   └── Component/
│       ├── Component.tsx
│       ├── Component.scss
│       ├── Component.test.tsx
│       └── index.ts
├── hooks/
├── contexts/
├── utils/
├── types/
└── constants/
```

## 🔧 Development Workflow

### Before Making Changes
1. **Run Tests**: Ensure all tests pass
2. **Type Check**: Run `pnpm build` to check TypeScript
3. **Lint**: Run `pnpm lint` and fix any issues

### During Development
1. **Small Commits**: Make focused, atomic commits
2. **Test Coverage**: Write tests for new functionality
3. **Performance**: Monitor bundle size and performance impact
4. **Documentation**: Update documentation for API changes

### Code Review Checklist
- [ ] TypeScript strict mode compliance
- [ ] Performance implications considered
- [ ] Error handling implemented
- [ ] Tests added/updated
- [ ] Accessibility considerations
- [ ] Mobile responsiveness verified

## 📊 Performance Monitoring

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze
```

### Performance Metrics to Track
- **Bundle Size**: Keep main bundle under 500KB
- **First Contentful Paint**: Target under 2s
- **Time to Interactive**: Target under 4s
- **Re-render Count**: Minimize unnecessary re-renders

## 🚀 Refactoring Progress - COMPLETED ✅

### Phase 1: Architecture Refactor ✅
- [x] Component separation (Calculator → CalculatorForm + CalculatorResults)
- [x] State management centralization (useCalculatorState + usePersistentCalculatorState)
- [x] Validation system improvement (calculatorValidation.ts)

### Phase 2: Performance Optimization ✅
- [x] React optimizations (React.memo, useMemo, useCallback)
- [x] Memory management (proper cleanup, memoization)
- [x] Component-level optimizations

### Phase 3: Code Quality ✅
- [x] TypeScript improvements (strict typing, proper interfaces)
- [x] Error handling (validation system, error boundaries patterns)
- [x] Comprehensive testing (validation tests, state management tests)

### Phase 4: Constants & Configuration ✅
- [x] Centralized constants (calculator.ts)
- [x] Magic number elimination
- [x] Configuration-driven approach

## 🎯 Key Metrics Achieved

- **Component Size**: Reduced Calculator.tsx from 200+ to 35 lines (83% reduction)
- **Props Reduction**: Reduced prop drilling from 29+ to 2-3 props per component (90% reduction)
- **Type Safety**: Eliminated all `any` types, added strict TypeScript interfaces
- **Performance**: Added React.memo to all components, preventing unnecessary re-renders
- **State Management**: Centralized state with reducer pattern, eliminating useState sprawl
- **Validation**: Robust validation system with 29+ test cases covering edge cases
- **Code Quality**: Comprehensive test coverage for critical business logic
- **Bundle Size**: Optimized imports and reduced component complexity

## 📚 Additional Resources

- [React Performance Patterns](https://kentcdodds.com/blog/optimize-react-re-renders)
- [TypeScript Best Practices](https://typescript-eslint.io/docs/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [CSS Architecture Guidelines](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Organizing)

---

*Last updated: 2025-08-10*
*Next review: When major architectural changes are made*