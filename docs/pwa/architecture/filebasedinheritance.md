# Layer Override System

## Concept
Since hubble PWA v3.0, the customization system is based on [Nuxt layers](https://nuxt.com/docs/getting-started/layers) instead of file copying. This provides better performance, cleaner architecture, and full compatibility with Nuxt 4.

The hubble module automatically creates a layer at `layers/hubble/` containing all components, pages, composables, and utilities. This layer can be overridden using Nuxt's standard layer priority system.

## Layer Priority
Hubble relies on Nuxt's standard layer priority system. Layer priority follows these rules:

1. **Main project** (highest priority) - files in project root
2. **Auto-discovered layers** - scanned alphabetically from `layers/` directory
3. **Explicitly extended layers** - reverse order from `extends` array in nuxt.config.ts

Since `layers/hubble/` is auto-discovered alphabetically, and "hubble" comes before most plugin names in the alphabet, the typical priority order becomes:
1. **Main project** (highest priority)
2. **Hubble core layer** (`layers/hubble/`)
3. **Plugin layers** (`layers/payment-plugin/`, `layers/my-plugin/`, etc., lowest priority)

::: warning Plugin Layer Priority
Due to alphabetical ordering, plugin layers starting with letters after "h" will have **lower priority** than the hubble core layer. To ensure plugin layers can override hubble components, consider:
- Naming plugin layers with prefixes before "h" (e.g., `layers/addon-payment/`)
- Or explicitly configure layer order using `extends` in nuxt.config.ts
:::

::: tip Explicit Layer Control
For precise control over layer priority, use the `extends` array in your nuxt.config.ts:
```ts
export default defineNuxtConfig({
    extends: ['./layers/my-plugin', './layers/hubble']
    // my-plugin will override hubble (reverse order)
})
```
:::

## Overriding Components and Files

### Step 1: Find the file to override
Browse the hubble layer structure in your project:
```
layers/hubble/
├── components/     # Vue components
├── pages/         # Nuxt pages
├── composables/   # Composables
├── utils/         # Utility functions
├── types/         # TypeScript types
└── assets/        # Static assets
```

### Step 2: Copy to project root
Copy the file to your project root with the same path structure:

```bash
# Example: Override the header component
cp layers/hubble/components/layout/LayoutHeader.vue components/layout/LayoutHeader.vue
```

### Step 3: Update imports (Critical!)
When copying files from the layer, you **must** update imports to use the named layer alias:

**Before (in layer):**
```vue
<!-- This works inside the layer -->
import { someUtil } from '../../utils/helper'
import SomeComponent from '../product/ProductCard.vue'
```

**After (in project root):**
```vue
<!-- This works in project root -->
import { someUtil } from '#layers/hubble/utils/helper'
import SomeComponent from '#layers/hubble/components/product/ProductCard.vue'
```

### Step 4: Customize and rebuild
1. Make your customizations to the copied file
2. Run `npm run dev` or rebuild your application
3. Your overridden file will take precedence

## Import Path Rules

### Within the same layer
- Use relative imports: `../../utils/helper`
- Use relative imports: `../components/SomeComponent.vue`

### From project root to layer files
- Use named alias: `#layers/hubble/utils/helper`
- Use named alias: `#layers/hubble/components/SomeComponent.vue`

### Global aliases (~/  @/)
- Always resolve to **project root**, not layer
- Avoid these when importing from layers

## Best Practices

::: tip Smart Overriding
Only override the specific files you need to customize. The layer system will automatically handle dependency resolution.
:::

::: warning Import Paths
Always update import paths when copying files from layers to project root. Forgetting this is the most common source of errors.
:::

::: tip Layer Development
You can create custom layers for organizing your own components and utilities while maintaining the override system.
:::
