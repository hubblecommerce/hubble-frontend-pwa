# Migration to Nuxt Layers - Task Breakdown

**Goal:** Replace file-based inheritance with Nuxt layers for Nuxt 4 compatibility and simplified architecture.

## Overview
- Remove complex file copying system (~160 lines)
- Create single unified Shopware layer
- Eliminate platform abstraction (Shopware-only)
- Maintain `platform-plugins/` naming distinction

**Approach:** Module copies layer to `layers/hubble/` directory where Nuxt automatically discovers and registers it (no manual extends needed).

---

## Phase 1: Create Layer Structure (2-3 days)

### 1.1 Setup Layer Structure for Nuxt Auto-Discovery
- [x] Create `src/layer/` directory (contains the actual layer)
- [x] Create `src/layer/nuxt.config.ts` for layer configuration
- [x] Update module to copy layer to `layers/hubble/` in user's project
- [x] Layer will be auto-discovered by Nuxt (no manual extends needed)

### 1.2 Move Theme Files to Layer
- [x] Move `src/theme/components/` → `src/layer/components/`
- [x] Move `src/theme/pages/` → `src/layer/pages/`
- [x] Move `src/theme/layouts/` → `src/layer/layouts/`
- [x] Move `src/theme/assets/` → `src/layer/assets/`
- [x] Move `src/theme/plugins/` → `src/layer/plugins/`
- [x] Move other theme directories (middleware, etc.)

### 1.3 Move Platform-Specific Files to Layer
- [x] Move `src/platforms/shopware/composables/` → `src/layer/composables/`
- [x] Remove `src/platforms/shopware/config/` set in layer nuxt.config.ts
- [x] Keep `src/platforms/shopware/api-client/` in module (not layer) - export as npm dependency

### 1.4 Merge Utilities in Layer
- [x] Create `src/layer/utils/` directory
- [x] Copy `src/commons/utils/` contents → `src/layer/utils/`
- [x] Merge `src/platforms/shopware/utils/` → `src/layer/utils/` (resolve conflicts)
- [x] Move `src/commons/utils/types/` → `src/layer/types/`

### 1.5 Configure Layer Auto-imports
- [x] Setup component auto-imports in `src/layer/nuxt.config.ts`
- [x] Configure utils auto-imports
- [x] Configure types auto-imports
- [x] Configure composables auto-imports
- [x] Set structure components as global (for dynamic resolution)

### 1.6 Layer-specific Configuration
- [x] Configure CSS imports in layer config
- [x] Setup i18n configuration for layer
- [x] Configure Tailwind CSS for layer
- [x] Setup color-mode configuration

### 1.7 Import Strategy for Layer Files (Critical!)
- [x] **Audit all current imports**: Find files using `~/` and `@/` aliases (won't work in layers)
- [x] **Convert to relative imports**: Change all internal layer imports to relative paths
  - [x] `~/utils/something` → `../../utils/something` (relative to file location)
  - [x] `@/components/Something.vue` → `../components/Something.vue`
  - [x] Audit `src/theme/`, `src/platforms/shopware/`, `src/commons/` for these patterns
- [x] **Layer config file paths**: Use `fileURLToPath` + `dirname` + `join` pattern in `nuxt.config.ts`
- [x] **Create index files**: Consider barrel exports for clean public API
  - [x] `src/layer/utils/index.ts` - Export main utilities
  - [x] `src/layer/composables/index.ts` - Export main composables
  - [x] `src/layer/types/index.ts` - Export main types
- [x] **Named alias becomes public**: `layers/hubble/` creates `#layers/hubble` for external imports

### 1.8 Module API Client Setup
- [x] Update module's `package.json` exports to include API client
- [x] Create clean export path: `@hubblecommerce/hubble/api-client`
- [x] Ensure API client is accessible as regular npm import (not layer)
- [x] Update composables in layer to import API client from module

---

## Phase 2: Simplify Main Module (1 day)

### 2.1 Implement Smart Layer Copying
- [x] Replace complex inheritance logic with optimized layer copying
- [x] Copy `src/layer/` → `layers/hubble/` only when needed
- [x] Create cache invalidation system (see optimization strategy below)
- [x] Remove file watching logic (lines ~313-397 in `src/module.ts`)
- [x] Remove `asyncCopyDirs` helper function
- [x] Remove directory blacklist logic

#### Smart Copying Optimization Strategy
- [x] Create `.hubble-layer-sync-cache.json` in user's project with module version + file hashes
- [x] Check if copying is needed:
  - [x] Target `layers/hubble/` doesn't exist
  - [x] Module version changed (from package.json)
  - [x] Cache file missing/corrupted
- [x] Skip copying if cache is valid (should save 100-500ms per build)
- [x] Update cache file after successful copy

### 2.2 Remove Platform Abstraction
- [x] Remove `PLATFORM` environment variable requirement
- [x] Remove platform detection logic
- [x] Remove `setDefaultRuntimeConfigs` platform-specific logic
- [x] Update error messages to remove platform references

### 2.3 Implement Layer Auto-Discovery
- [x] No manual extends needed - Nuxt auto-discovers `layers/hubble/`
- [x] Remove all srcDir manipulation logic
- [x] Remove complex alias manipulation (keep basic ones if needed)
- [x] Ensure layer copying happens during module setup

### 2.4 Preserve Essential Module Logic
- [x] Keep Pinia installation (`@pinia/nuxt`)
- [x] Keep VueUse installation (`@vueuse/nuxt`)
- [x] Move i18n installation to layer nuxt.config.ts (`@nuxtjs/i18n`)
- [x] Move color-mode installation to layer nuxt.config.ts (`@nuxtjs/color-mode`)
- [x] Move cookie configuration logic to layer nuxt.config.ts
- [x] Keep runtime config merging (simplified)

### 2.5 Clean Up Module Options
- [x] Remove `targetDirName` option (obsolete)
- [x] Remove `dirBlacklist` option (obsolete)
- [x] Remove `watchPaths` option (obsolete)
- [x] Remove plugin-related options
- [x] Remove cookie-related options
- [x] Update ModuleOptions interface

---

## Phase 3: Refactor Platform-Plugins Installation (1.5 days)

### 3.1 Update Plugin Installation Script
- [ ] **Refactor `src/platforms/shopware/bin/sw-plugins-assets.js`**
  - [ ] Change target from `platform-plugins/plugin-name/` to `layers/plugin-name/`
  - [ ] Each plugin becomes its own layer directory
  - [ ] Create `nuxt.config.ts` for each plugin layer if needed
  - [ ] Maintain plugin file structure (components, pages, etc.)

### 3.2 Update Platform-Plugins Directory Structure
- [ ] **Refactor `platform-plugins/` directory purpose**
  - [ ] Keep only configuration files: `pluginConfig.json`, `pluginMapping.json`
  - [ ] Remove plugin source files (now in `layers/plugin-name/`)
  - [ ] Update documentation to reflect new structure
- [ ] **Layer auto-discovery**: Each plugin in `layers/` automatically discovered by Nuxt
- [ ] **Layer priority**: User files > Plugin layers > Main hubble layer

### 3.3 Update Module Plugin Handling
- [ ] **Config loading**: Module still reads `platform-plugins/pluginConfig.json`
- [ ] **Mapping system**: Module still processes `platform-plugins/pluginMapping.json`
- [ ] **Runtime config merging**: Plugin configs merged to `nuxt.options.runtimeConfig.public`
- [ ] **Remove plugin file copying**: No longer needed (plugins are layers)

### 3.4 Update Related CLI Commands
- [ ] **Update `npm run sw:install-plugins`** to use new layer-based installation
- [ ] **Update `npm run sw:config-plugins`** if needed
- [ ] **Test plugin installation flow** with new layer structure
- [ ] **Update any plugin-related documentation**

### 3.5 Test Plugin Layer System
- [ ] **Test plugin installation**: `sw-plugins-assets.js` creates `layers/plugin-name/`
- [ ] **Test layer auto-discovery**: Plugin layers automatically registered
- [ ] **Test component override**: Plugin components override main hubble layer
- [ ] **Test config loading**: `pluginConfig.json` and `pluginMapping.json` still work
- [ ] **Test layer priority**: User project > Plugin layers > Hubble layer

---

## Phase 4: Environment & Configuration Simplification (0.5 days)

### 4.1 Environment Variables
- [ ] Remove `PLATFORM` env var from documentation
- [ ] Keep Shopware-specific env vars (`API_SW_ACCESS_KEY`, `API_BASE_URL`)
- [ ] Update `.env.example` if it exists
- [ ] Update error messages for missing env vars

### 4.2 Update Documentation
- [ ] Update README.md to remove platform selection
- [ ] Update CLAUDE.md to reflect new architecture
- [ ] Update any other documentation references to platforms

---

## Phase 5: Testing & Validation (1-2 days)

### 5.0 Refactor Test Suite for Layer Architecture
- [ ] **Update `__tests__/module/module.spec.ts`** - Rewrite tests for layer-based system
  - [ ] Remove "Files based inheritance" tests (obsolete)
  - [ ] Add layer auto-discovery tests (`layers/hubble/` exists)
  - [ ] Update component override tests (project files vs layer files)
  - [ ] Update platform-plugins tests (still relevant but different paths)
  - [ ] Remove PLATFORM environment variable tests (no longer used)
- [ ] **Update test fixture** (`__tests__/module/fixture/`)
  - [ ] Remove old file copying expectations
  - [ ] Test that `layers/hubble/` directory is created
  - [ ] Update component import tests for new structure
  - [ ] Verify platform-plugins override `layers/hubble/` components
- [ ] **Add layer-specific tests**
  - [ ] Test `#layers/hubble` alias works externally
  - [ ] Test relative imports work within layer files
  - [ ] Test API client imports from module (not layer)
- [ ] **Test smart caching**
  - [ ] Verify `.hubble-layer-sync-cache.json` creation and usage
  - [ ] Test layer copying skipped when cache valid

### 5.1 Basic Functionality Testing
- [ ] Test playground with new layer system
- [ ] Verify all components render correctly
- [ ] Test all pages load correctly
- [ ] Verify composables work properly
- [ ] Test API client imports from module (not layer)

### 5.2 Nuxt 4 Compatibility Testing
- [ ] Enable `compatibilityVersion: 4` in playground
- [ ] Verify build succeeds
- [ ] Test development server works
- [ ] Test production build works
- [ ] Verify no inheritance issues

### 5.3 Override System Testing
- [ ] Create test components in project root
- [ ] Verify they override layer components
- [ ] Test plugin layer override system (`layers/plugin-name/` components override `layers/hubble/`)
- [ ] Test pages can be overridden
- [ ] Test utils can be overridden

### 5.4 Feature Validation
- [ ] Test i18n functionality
- [ ] Test runtime configuration
- [ ] Test cookie management
- [ ] Test global component registration
- [ ] Test auto-imports work correctly
- [ ] Test Tailwind CSS compilation
- [ ] Test color-mode functionality

### 5.5 Integration Testing
- [ ] Test with existing Hubble projects (if possible)
- [ ] Verify no breaking changes in public API
- [ ] Test CLI commands still work
- [ ] Test build process works correctly

---

## Phase 6: Cleanup & Documentation (0.5 days)

### 6.1 Code Cleanup
- [ ] Remove unused imports from `src/module.ts`
- [ ] Remove unused helper functions
- [ ] Clean up package.json dependencies (if any)
- [ ] Update TypeScript types

### 6.2 Final Documentation Updates
- [ ] Update package.json description
- [ ] Update installation instructions
- [ ] Update development workflow documentation
- [ ] **Add layer override documentation**: Guide users on import path changes when copying files
  - [ ] Document: When copying `layers/hubble/components/SomeComponent.vue` to project root
  - [ ] User must change relative imports to named alias: `../../utils/helper` → `#layers/hubble/utils/helper`
  - [ ] Provide clear examples of this pattern in README
  - [ ] Explain why: Global aliases (`~/`, `@/`) resolve to user project, not layer

### 6.3 Platform-Plugin Documentation Refactor
- [ ] **Update platform-plugin documentation** for new layer-based architecture
  - [ ] Document new installation flow: `sw-plugins-assets.js` → `layers/plugin-name/`
  - [ ] Update plugin development guide for layer structure
  - [ ] Document `platform-plugins/` directory now contains config files only
  - [ ] Update plugin override examples (layer priority)
  - [ ] Document plugin layer auto-discovery behavior
- [ ] **Update CLI command documentation**
  - [ ] `npm run sw:install-plugins` new behavior
  - [ ] `npm run sw:config-plugins` changes (if any)
  - [ ] Plugin management workflow updates

### 6.4 Create User Migration Guide
- [ ] **Write comprehensive upgrade path** for existing module users
- [ ] **Breaking changes documentation**:
  - [ ] Platform-plugins now installed as layers (not copied files)
  - [ ] `platform-plugins/` directory structure changed
  - [ ] Component import paths may need updates
  - [ ] Layer override behavior changes
- [ ] **Step-by-step migration instructions**:
  - [ ] How to update existing platform-plugins setup
  - [ ] How to migrate custom component overrides
  - [ ] How to test new layer-based system
  - [ ] Rollback instructions if needed
- [ ] **Reference related documentation sections**:
  - [ ] Link to layer override guide (6.2)
  - [ ] Link to platform-plugin docs (6.3)
  - [ ] Link to import strategy documentation
  - [ ] Link to troubleshooting section

---

## Success Criteria
- [ ] ✅ Playground works with `compatibilityVersion: 4`
- [ ] ✅ All existing functionality preserved
- [ ] ✅ Component override system works identically
- [ ] ✅ `platform-plugins/` system works correctly
- [ ] ✅ Significant code reduction in main module
- [ ] ✅ No file copying/watching complexity
- [ ] ✅ Layer-based inheritance working properly

**Estimated Total Time:** 4-6 days