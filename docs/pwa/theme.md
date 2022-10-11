# Default Theme

## Theming approach

hubble PWA provides a default theme which you can use and modify using 
[file based inheritance](/pwa/architecture/filebasedinheritance.html#overwriting-files).

To keep the development process clear, all components of the default theme relates heavily to the single file component 
approach. That means templating, business logic and styling are capsuled in one file each component.

## Tailwind CSS + daisyUI
As a solid base Tailwind CSS is integrated via [@nuxtjs/tailwindcss](https://tailwindcss.nuxtjs.org/).
And because we don't like class bloated templates, we decided to use [daisyUI](https://daisyui.com/) a Tailwind CSS 
component library.

### Configuration
Simply create a `tailwind.config.ts` in your project root directory to configure your tailwind setup as usual. 

```ts
export default {
    theme: {
        extend: {
            // extend Tailwind CSS as usual
        }
    },
    // Extend / Create / Configure your daisyUI themes
    daisyui: {
        themes: [
            {
                mytheme: {
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
                    "primary": "#dc2626",
                    "secondary": "#111827",
                    "accent": "#f472b6",
                    "neutral": "#111827",
                    "base-100": "#f3f4f6",
                    "info": "#3ABFF8",
                    "success": "#36D399",
                    "warning": "#FBBD23",
                    "error": "#F87272",
                },
            }
        ],
    },
}

```

## SCSS
If Tailwind and daisyUI is not enough for you because you want to style a component individually or want to use 
scss variables, [sass](https://github.com/sass/dart-sass) is preinstalled for you. 

### Enable SCSS
To use it with Nuxt 3 you can simply enhance your vite configuration in your `nuxt.config.ts` like:
```js
...
vite: {
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/assets/scss";'
            }
        }
    }
}
...
```

### Create SCSS files
Create `assets/scss/_index.scss` file and include some SCSS like variables:

```scss
// Add your own variables
$primary: #D00171;

// Add custom styling
.custom-element {
  .custom-child {
    color: $primary;
  }
}

// Override daisyUI components
.btn {
  @apply rounded-full;
}
```

### Usage in .vue components
You can use all the scss in your components without the need of import them.

::: tip
Don't forget to set `lang="scss"` to the style tag to make the scss compiler work.
:::

```vue
<style lang="scss">
.some-component-element {
    color: $primary;
}
</style>
```
