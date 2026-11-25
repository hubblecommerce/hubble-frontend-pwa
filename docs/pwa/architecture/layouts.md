# Layouts
[See the layouts on github](https://github.com/hubblecommerce/hubble-frontend-pwa/tree/main/src/layer/layouts)

<img src="/assets/images/layout@2x.jpg" alt="hubble PWA Layout" style="width: 100%;" />

## Default
hubble provides a default layout which is called default.vue (this layout is loaded by Nuxt automatically, if
you don't set a layout for a page manually).

## Checkout
The checkout layout is a lighter, distraction free version of the default layout.

## Error
There is currently no layout overriding the Nuxt error page. Checkout payment errors are instead handled by a
dedicated page: [pages/checkout/error.vue](https://github.com/hubblecommerce/hubble-frontend-pwa/blob/main/src/layer/pages/checkout/error.vue).
