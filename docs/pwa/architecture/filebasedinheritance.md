# Layer Override System

## Concept
Since hubble PWA v3.0, the customization system is based on [Nuxt layers](https://nuxt.com/docs/getting-started/layers) instead of file copying. This provides better performance, cleaner architecture, and full compatibility with Nuxt 4.

The hubble module automatically creates a layer at `layers/hubble/` containing all components, pages, composables, and utilities. This layer can be overridden using Nuxt's standard layer priority system.

## Layer Priority
Hubble relies on Nuxt's standard layer priority system. Layer priority follows these rules (https://nuxt.com/docs/4.x/getting-started/layers#layer-priority):

1. **Main project** (highest priority) - files in project root
2. **Auto-discovered layers** - scanned alphabetically from `layers/` directory
3. **Explicitly extended layers** - reverse order from `extends` array in nuxt.config.ts

Since `layers/hubble/` is auto-discovered alphabetically, and "hubble" comes before most plugin names in the alphabet, the typical priority order becomes:
1. **Main project** (highest priority)
2. **Hubble core layer** (`layers/hubble/`)
3. **Plugin layers** (`layers/a-plugin/`, `layers/b-plugin/`, etc., lowest priority)

::: warning Plugin Layer Priority
Due to alphabetical ordering, plugin layers starting with letters before "h" will have **lower priority** than the hubble core layer. To ensure plugin layers can override hubble components, consider:
- Naming plugin layers with prefixes after "h" (e.g., `layers/z-plugin/`)
- Or change the name of the hubble layer via the module config (`hubble.layerName`)
- Or explicitly configure layer order using `extends` in nuxt.config.ts
:::

::: tip Custom Hubble Layer Name
You can also change the default name of the hubble layer via the module option layerName in the nuxt config:
```ts
export default defineNuxtConfig({
    hubble: {
        layerName: 'customName'
    },
})
```
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
├── components/    # Vue components
├── pages/         # Nuxt pages
├── composables/   # Composables
├── utils/         # Utility functions
│   └── mapping/   # Data mapping functions
├── types/         # TypeScript types
├── plugins/       # Plugins
└── assets/        # Static assets
    └── css/       # CSS files (special override behavior)
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

## CSS Override System

### Automatic CSS Loading
Hubble automatically provides default styles out-of-the-box without any configuration required from the consumer.

### CSS Override Pattern
CSS files have a **special override behavior** different from other files, because **Nuxt layers don't support overriding assets by file**:

#### Default Behavior (No Configuration Needed)
- **Hubble automatically loads** `layers/hubble/assets/css/tailwind.css`
- **Works immediately** - consumer gets styled components without setup

#### Override Behavior
To override the default styles:

1. **Create your CSS file** in one of these locations:
   ```bash
   # Nuxt 3 structure:
   assets/css/tailwind.css

   # Nuxt 4 structure:
   app/assets/css/tailwind.css
   ```

2. **Add CSS to your nuxt.config.ts:**
   ```ts
   export default defineNuxtConfig({
       css: [
           'assets/css/tailwind.css'
       ]
   })
   ```

3. **Result**: Only your CSS loads, layer CSS is automatically excluded

::: warning No Duplicate Loading
When you provide your own CSS file, the layer CSS is **automatically disabled** to prevent conflicts. You must explicitly add your CSS to the `css` array in `nuxt.config.ts`.
:::

## Plugin Override System

### Automatic Plugin Override
Hubble automatically handles plugin overrides without any configuration needed.

### Plugin Override Pattern
When you create a plugin with the same filename as a layer plugin, the module automatically filters out the layer plugin to prevent conflicts, because **Nuxt layers don't support overriding plugins by file**.

#### How It Works
1. **Layer provides plugins** in `layers/hubble/plugins/`
2. **Create override plugin** in your project:
   ```bash
   # Nuxt 3 structure:
   plugins/event-bus.ts

   # Nuxt 4 structure:
   app/plugins/event-bus.ts
   ```
3. **Automatic filtering** - Layer plugin is automatically removed
4. **Only your plugin runs** - No "Cannot redefine property" errors

#### Supported Plugin Types
- **Regular plugins**: `plugins/myPlugin.js`
- **Client-only plugins**: `plugins/myPlugin.client.js`
- **Server-only plugins**: `plugins/myPlugin.server.js`
