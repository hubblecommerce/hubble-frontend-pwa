# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Hubble Commerce**, a headless e-commerce PWA built as a Nuxt.js module. It provides a framework for creating shop frontends, with primary support for Shopware 6.

- **Main package**: `@hubblecommerce/hubble` - A Nuxt.js module for e-commerce PWAs
- **Architecture**: File-based inheritance system with platform-specific implementations
- **Primary platform**: Shopware 6 (via environment variable `PLATFORM=shopware`)

## Common Development Commands

### Development
```bash
npm run dev                    # Start development server (playground)
npm run dev:build              # Build playground for production
npm run dev:build:analyze      # Build with bundle analysis
npm run dev:prepare            # Clean and prepare development environment
```

### Testing
```bash
npm run test:integration       # Run integration tests with Vitest
npm run test:e2e               # Run end-to-end tests with Cypress
npm run test:prepare:e2e       # Prepare for e2e tests
npm run test:cypress:run       # Run Cypress tests
npm run coverage               # Run tests with coverage
```

### Code Quality
```bash
npm run lint                   # ESLint with auto-fix for *.{js,vue} files
```

### Building
```bash
npm run prepack                # Build module using nuxt-module-build
```

### CLI Tools
```bash
node bin/hubble-cli.js <command>  # Main CLI tool
npm run i18n:export               # Export translations to CSV
npm run i18n:import               # Import translations from CSV
```

### Shopware-specific Commands
```bash
npm run sw:dev:generate-api       # Generate Shopware API client
npm run sw:install-plugins        # Install Shopware plugin assets
npm run sw:config-plugins         # Configure Shopware plugins
npm run sw:languages              # Configure languages
```

## Architecture

### File-based Inheritance
The module uses a sophisticated file-based inheritance system:

1. **Base layer**: `src/theme/` - Core components and pages
2. **Platform layer**: `src/platforms/shopware/` - Platform-specific implementations
3. **Commons layer**: `src/commons/` - Shared utilities and types
4. **Project layer**: Root directory files override module files
5. **Plugin layer**: `platform-plugins/` - Plugin-specific overrides

Files are copied to `.hubble/` directory in this inheritance order, where later layers can override earlier ones.

### Key Directories
- `src/theme/components/` - Vue components organized by feature (cart, customer, checkout, etc.)
- `src/theme/pages/` - Nuxt.js pages
- `src/platforms/shopware/` - Shopware-specific API client, composables, and utilities
- `src/commons/utils/types/` - TypeScript type definitions with `Hbl` prefix
- `playground/` - Development playground for testing the module

### Component Structure
- **Structure components**: `components/structure/` - Global components for CMS/page building
- **Feature components**: `components/{cart,customer,checkout,product}/` - Domain-specific components
- **Layout components**: `components/layout/` - App-wide layout components

### Platform Integration
- Uses environment variable `PLATFORM` (typically "shopware")
- Platform-specific configs in `src/platforms/{platform}/config/config.ts`
- API clients generated from OpenAPI specs
- Mapping utilities convert platform data to internal `Hbl` types

## Configuration Files

- **ESLint**: `.eslintrc` - 4-space indentation, single quotes, no semicolons
- **TypeScript**: Uses Nuxt's built-in TypeScript support
- **Vitest**: `vitest.config.ts` - Integration testing setup
- **Module**: `src/module.ts` - Main Nuxt module definition

## Development Workflow

1. **Environment setup**: Requires `.env` file with `PLATFORM` and platform-specific credentials
2. **Development**: Use `npm run dev:prepare` then `npm run dev`
3. **Testing**: Run `npm run test:integration` for Vitest tests
4. **Code style**: Must pass `npm run lint` (automatically fixes many issues)
5. **Building**: Use `npm run prepack` to build the distributable module

## Important Notes

- All global structure components are automatically registered
- Uses Pinia for state management
- Supports i18n with strategy 'prefix_and_default'
- Platform plugins cannot override hubble module files (strict inheritance order)
- Development file watcher automatically syncs changes to `.hubble/` directory
- API client for Shopware is generated and may have custom patches applied