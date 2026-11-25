# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Hubble Commerce**, a headless e-commerce PWA built as a Nuxt.js module. It provides a framework for creating shop frontends, with primary support for Shopware 6.

- **Main package**: `@hubblecommerce/hubble` - A Nuxt.js module for e-commerce PWAs
- **Architecture**: Nuxt layer-based system with Shopware 6 integration
- **Primary platform**: Shopware 6

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
npm run sw:config-plugins         # Configure Shopware plugins and generate mappings
npm run sw:languages              # Configure languages
```

**Note:** Plugin layers are created manually in `layers/plugin-name/` (see Plugin Layer Setup below).

## Architecture

### Nuxt Layer Override System
Customization is based on [Nuxt layers](https://nuxt.com/docs/getting-started/layers):

1. **Source**: `src/layer/` - All components, pages, composables, and utilities
2. **Runtime layer**: automatically created at `layers/hubble/` (synced from `src/layer/` by the dev file watcher)
3. **Platform code**: `src/platforms/shopware/` - Shopware-specific API client generation and CLI scripts
4. **Project layer**: root directory files override the hubble layer (highest priority)
5. **Plugin layer**: `layers/plugin-name/` - manually created plugin layers (lowest priority by default, alphabetical layer discovery)

Layer priority follows Nuxt's standard rules: main project > auto-discovered `layers/` (alphabetical) > `extends` array order. See `docs/pwa/architecture/filebasedinheritance.md` for the full override workflow (import alias rules, CSS/plugin override caveats).

### Key Directories
- `src/layer/components/` - Vue components organized by feature (cart, customer, checkout, etc.)
- `src/layer/pages/` - Nuxt.js pages
- `src/layer/composables/`, `src/layer/utils/` - Composables and utility/mapping functions
- `src/platforms/shopware/api-client/` - Generated Shopware API client
- `playground/` - Development playground for testing the module (`playground/layers/hubble/` is the synced copy of `src/layer/`)

### Component Structure
- **Structure components**: `components/structure/` - Global components for CMS/page building
- **Feature components**: `components/{cart,customer,checkout,product}/` - Domain-specific components
- **Layout components**: `components/layout/` - App-wide layout components

### Platform Integration
- Built for Shopware 6 platform
- Shopware env/config defaults live in `src/layer/config/` (e.g. `.env_example`)
- API clients generated from OpenAPI specs via `src/platforms/shopware/bin/`
- Mapping utilities convert platform data to internal `Hbl` types

### Plugin Layer Setup (Manual)
Plugins are set up manually:

1. **Create plugin layer**: `layers/plugin-name/`
2. **Add plugin structure**:
   ```
   layers/plugin-name/
   ├── components/          # Plugin Vue components
   ├── pages/              # Plugin pages
   ├── layouts/            # Plugin layouts (optional)
   ├── middleware/         # Plugin middleware (optional)
   ├── plugins/            # Plugin initialization files (optional)
   ├── assets/             # Plugin assets (optional)
   └── nuxt.config.ts      # Plugin layer configuration
   ```
3. **Configure plugin**: Run `npm run sw:config-plugins` to generate:
   - `platform-plugins/pluginConfig.json` - Plugin runtime configuration
   - `platform-plugins/pluginMapping.json` - Plugin slot mappings
4. **Layer auto-discovery**: Nuxt automatically discovers plugin layers
5. **Layer priority**: User files > Plugin layers > Main hubble layer

## Configuration Files

- **ESLint**: `eslint.config.js` (flat config, based on `@nuxt/eslint-config`) - 4-space indentation, single quotes, no semicolons
- **TypeScript**: Uses Nuxt's built-in TypeScript support
- **Vitest**: `vitest.config.ts` - Integration testing setup
- **Module**: `src/module.ts` - Main Nuxt module definition

## Development Workflow

1. **Environment setup**: Requires `.env` file with Shopware API credentials
2. **Development**: Use `npm run dev:prepare` then `npm run dev`
3. **Testing**: Run `npm run test:integration` for Vitest tests
4. **Code style**: Must pass `npm run lint` (automatically fixes many issues)
5. **Building**: Use `npm run prepack` to build the distributable module

## Important Notes

- All global structure components are automatically registered
- Uses Pinia for state management
- Supports i18n with strategy 'prefix_and_default'
- Platform plugins cannot override hubble module files (strict inheritance order)
- Development file watcher automatically syncs changes from `src/layer/` to `layers/hubble/` (tracked via `.hubble-layer-sync-cache.json`)
- API client for Shopware is generated and may have custom patches applied