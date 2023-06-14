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

## Custom Styles / PostCSS
If you want to override a daisyUI component or even write your own component and provide it via a semantic class name,
you can use the assets/css directory. Start at the tailwind entry point `assets/css/tailwind.css`, where we already
created a `custom.pcss` file for you in which you can import all your custom written CSS.

### assets/css/tailwind.css
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';

@import './custom.pcss';

@import 'tailwindcss/utilities';
```

### assets/css/custom.pcss
```postcss
/* Custom CSS Files */
@import './components/myCustomComponent.pcss';
```
