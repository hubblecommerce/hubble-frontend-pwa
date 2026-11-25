# Default Theme

## Theming approach

hubble PWA provides a default theme which you can use and modify using 
[file based inheritance](/pwa/architecture/filebasedinheritance.html#overwriting-files).

To keep the development process clear, all components of the default theme relates heavily to the single file component 
approach. That means templating, business logic and styling are capsuled in one file each component.

## Tailwind CSS + daisyUI
As a solid base Tailwind CSS v4 is integrated via the official 
[`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/using-vite) plugin. There is no PostCSS config and
no module option to toggle it - it's wired directly into the Vite build.

And because we don't like class bloated templates, we decided to use [daisyUI](https://daisyui.com/) a Tailwind CSS 
component library.

### Configuration
Tailwind v4 is configured in CSS, not in a `tailwind.config.ts`. To extend the theme or daisyUI config, override
`assets/css/tailwind.css` (see [CSS override system](/pwa/architecture/filebasedinheritance.html#css-override-system))
and adjust it there, e.g.:

```css
@import 'tailwindcss';

@plugin "daisyui" {
    themes: mytheme --default;
}

@plugin "daisyui/theme" {
    name: "mytheme";
    --color-primary: #dc2626;
    --color-secondary: #111827;
    --color-accent: #f472b6;
    --color-neutral: #111827;
    --color-base-100: #f3f4f6;
}
```

See the [daisyUI theme docs](https://daisyui.com/docs/themes/) for all available theme options.

## Custom Styles
If you want to override a daisyUI component or even write your own component and provide it via a semantic class name,
you can use the assets/css directory. Start at the tailwind entry point `assets/css/tailwind.css`, where we already
created a `custom.pcss` file for you in which you can import all your custom written CSS.

### assets/css/tailwind.css
```css
@import 'tailwindcss';

@import './custom.pcss' layer(components);
@plugin "daisyui";
```

### assets/css/custom.pcss
```css
/* Custom CSS Files */
@import './components/myCustomComponent.pcss';
```
