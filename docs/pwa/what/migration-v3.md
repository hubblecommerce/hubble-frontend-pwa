# Migration Guide: Upgrading to Hubble PWA v3.0

This guide helps you upgrade from Hubble PWA v2.x to v3.0, which introduces a new layer-based architecture replacing the previous file-based inheritance system.

## Overview

Hubble PWA v3.0 represents a major architectural change:
- **Before**: File-based inheritance with `.hubble` directory and file copying
- **After**: Nuxt layer-based system with `layers/hubble/` auto-discovery

This change provides better performance, cleaner architecture, and full compatibility with Nuxt 4.

## Breaking Changes

### 1. Platform-plugins now installed as layers

**Before (v2.x):**
- Plugins were automatically downloaded and copied to `platform-plugins/` directory
- Used `npm run sw:install-plugins` for automatic installation
- Plugin files were mixed with config files in `platform-plugins/`

**After (v3.0):**
- Plugins must be manually created as Nuxt layers in `layers/plugin-name/`
- `npm run sw:install-plugins` has been removed (shows deprecation message)
- Only `npm run sw:config-plugins` is available for configuration management

### 2. Platform-plugins/ Directory Structure Changed

**Before (v2.x):**
```
platform-plugins/
├── plugin-a/              # Plugin A files
├── plugin-b/              # Plugin B files
├── pluginConfig.json      # Plugin configurations
└── pluginMapping.json     # Plugin mappings
```

**After (v3.0):**
```
platform-plugins/
├── pluginConfig.json      # Plugin configurations only
└── pluginMapping.json     # Plugin mappings only

layers/
├── plugin-a/              # Plugin A as layer
└── plugin-b/              # Plugin B as layer
    ├── components/
    ├── pages/
    ├── nuxt.config.ts
    └── pluginMapping.json
```

### 3. Component Import Paths May Need Updates

**Before (v2.x):**
- Could use global aliases (`~/`, `@/`) anywhere
- All files were copied to `.hubble` directory

**After (v3.0):**
- When copying files from `layers/hubble/` to project root, imports must be updated
- Global aliases (`~/`, `@/`) resolve to project root, not layer
- Must use `#layers/hubble/` alias when importing from layer

**Example:**
```vue
<!-- Before: In layer file -->
import { someUtil } from '../../utils/helper'

<!-- After: In project root file -->
import { someUtil } from '#layers/hubble/utils/helper'
```

### 4. Layer Override Behavior Changes

**Before (v2.x):**
- Simple file replacement in `.hubble` directory
- Order: Project files → Platform plugins → Hubble core

**After (v3.0):**
- Nuxt layer priority system
- Order depends on alphabetical naming and explicit configuration
- Default: Project → Hubble layer → Plugin layers (alphabetically after "hubble")

## Step-by-Step Migration Instructions

### Step 1: Update Your Project Dependencies

1. **Update hubble module:**
   ```bash
   npm update @hubblecommerce/hubble
   ```

2. **Remove deprecated environment variable:**
   ```bash
   # Remove from your .env file:
   # PLATFORM=shopware
   ```

3. **Clean up .hubble directory:**
   ```bash
   # This directory is no longer used
   rm -rf .hubble
   ```

### Step 2: Migrate Platform-plugins Setup

1. **Backup your current plugin files:**
   ```bash
   cp -r platform-plugins/ platform-plugins-backup/
   ```

2. **For each plugin directory in platform-plugins/, create a layer:**
   ```bash
   # Example: migrate plugin-a and plugin-b
   mkdir -p layers/plugin-a
   cp -r platform-plugins/plugin-a/* layers/plugin-a/

   mkdir -p layers/plugin-b
   cp -r platform-plugins/plugin-b/* layers/plugin-b/
   ```

3. **Add layer configuration to each plugin:**
   ```ts
   // layers/your-plugin-name/nuxt.config.ts
   export default defineNuxtConfig({
       components: [
           {
               path: '~/components',
               pathPrefix: false
           }
       ]
   })
   ```

4. **Run configuration script to regenerate mappings:**
   ```bash
   npm run sw:config-plugins
   ```

5. **Clean up old plugin directories (after successful migration):**
   ```bash
   # Only remove after verifying layers work correctly
   rm -rf platform-plugins/plugin-a
   rm -rf platform-plugins/plugin-b
   # Keep only pluginConfig.json and pluginMapping.json
   ```

### Step 3: Migrate Custom Component Overrides

1. **Find your custom overrides:**
   - Look for files in your project root that override hubble components
   - Common locations: `components/`, `pages/`, `composables/`

2. **Update import paths in overridden files:**

   **Imports that stay the same:**
   ```vue
   <!-- These imports remain unchanged in your overridden files -->
   <script setup>
   // Auto-imports (composables, utilities, etc.)
   import { usePlaceAutocomplete, usePlatform } from '#imports'

   // Your own project files
   import { type MyCustomType } from '@/utils/types'
   import MyComponent from '@/components/MyComponent.vue'

   // Direct module imports (API client)
   import { type Cart as SwCart } from '@hubblecommerce/hubble/platforms/shopware/api-client'

   // Standard library imports
   import { ref, computed, onMounted } from 'vue'
   import { storeToRefs } from 'pinia'
   import { useI18n } from 'vue-i18n'
   </script>
   ```

   **Imports that need updating in your existing overridden files:**
   ```vue
   <!-- Before (v2.x): Importing hubble resources via @/ paths -->
   <script setup>
   // Hubble types
   import { type HblCustomerBillingAddress, type HblProduct } from '@/utils/types'

   // Hubble components
   import ProductCard from '@/components/product/ProductCard.vue'
   import CartList from '@/components/cart/CartList.vue'

   // Hubble utilities
   import { formatPrice } from '@/utils/formatting'
   import { hblMapProduct } from '@/utils/mapping'

   // Hubble composables (if not auto-imported)
   import { useCart } from '@/composables/useCart'
   </script>

   <!-- After (v3.0): Must use layer alias for hubble resources -->
   <script setup>
   // Hubble types
   import { type HblCustomerBillingAddress, type HblProduct } from '#layers/hubble/types'

   // Hubble components
   import ProductCard from '#layers/hubble/components/product/ProductCard.vue'
   import CartList from '#layers/hubble/components/cart/CartList.vue'

   // Hubble utilities
   import { formatPrice } from '#layers/hubble/utils/formatting'
   import { hblMapProduct } from '#layers/hubble/utils/mapping'

   // Hubble composables (if not auto-imported)
   import { useCart } from '#layers/hubble/composables/useCart'
   </script>
   ```

   **Key rule:** In your existing overridden files, change imports that reference hubble resources:
   - `@/utils/types/Hbl*` → `#layers/hubble/types`
   - `@/components/*` → `#layers/hubble/components/*` (for hubble components)
   - `@/utils/mapping/*` → `#layers/hubble/utils/mapping/*`
   - `@/utils/helper/*` → `#layers/hubble/utils/helper/*`
   - `@/composables/*` → `#layers/hubble/composables/*` (if not auto-imported)
   - Keep `@/` for your own project files (non-hubble resources) or imported files that you have also overridden. For example:
      - If I override CartList.vue and it imports ProductCard.vue
      - AND I also override ProductCard.vue
      - Then in my overridden CartList.vue, I should use @/components/product/ProductCard.vue (not #layers/hubble/components/product/ProductCard.vue)


### Step 4: Test New Layer-based System

1. **Verify layer auto-discovery:**
   ```bash
   npm run dev
   # Check that layers/hubble/ directory is created automatically
   ```

2. **Test plugin functionality:**
   - Verify plugin components are rendered
   - Check plugin configurations are loaded
   - Test plugin slot mappings work

3. **Test component overrides:**
   - Verify project files override layer files
   - Test plugin layer priority

4. **Test your project build:**
   ```bash
   # Test development build
   npm run dev

   # Test production build
   npm run build

   # If you have your own tests, run them
   npm run test  # (if available in your project)
   ```

### Step 5: Update Build and Deployment Scripts

1. **Update .gitignore:**
   ```gitignore
   # Remove deprecated entry:
   # .hubble

   # Add new entries:
   layers/hubble/
   .hubble-layer-sync-cache.json
   ```

2. **Update CI/CD scripts:**
   - Remove any references to `.hubble` directory
   - Ensure `layers/hubble/` is properly handled in builds

## Rollback Instructions (If Needed)

If you encounter issues and need to rollback:

1. **Downgrade to previous version:**
   ```bash
   npm install @hubblecommerce/hubble@2.x
   ```

2. **Restore environment variable:**
   ```bash
   # Add back to .env:
   PLATFORM=shopware
   ```

3. **Restore plugin assets:**
   ```bash
   cp -r platform-plugins-backup/ platform-plugins/
   ```

## Troubleshooting Common Issues

### Issue: Components not rendering or build errors with import paths

**Solution:** Check import paths in overridden components:
- Update hubble imports from `@/` to `#layers/hubble/` alias
- Keep `@/` for your own project files or files you've also overridden
- Ensure all imports from hubble layer use the correct `#layers/hubble/` format

### Issue: Plugin components not showing

**Solution:**
1. Verify plugin layer structure in `layers/plugin-name/`
2. Run `npm run sw:config-plugins` to regenerate mappings
3. Check plugin layer naming for alphabetical priority

## Getting Help

- **Layer override documentation**: [Layer Override System](/pwa/architecture/filebasedinheritance.html)
- **Plugin setup guide**: [Shopware Plugins](/pwa/shopware/shopwareplugins.html)
- **Import strategy documentation**: Available in the layer override guide
- **Troubleshooting**: [General troubleshooting](/pwa/what/troubleshooting.html)

For additional support, please check our [GitHub issues](https://github.com/hubblecommerce/hubble-frontend-pwa/issues).