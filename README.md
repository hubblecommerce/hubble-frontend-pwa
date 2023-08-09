<br>

<img src="https://docs.hubblecommerce.io/assets/images/hubblelogo.svg" style="height:50px" />

# Headless E-Commerce Interface
> Progressive Web App for your e-commerce platform based on [Nuxt.js](https://nuxtjs.org/)

- [x] An open source project
- [x] Installable as a Nuxt.js Module
- [x] Compatible with Shopware 6
- [x] Covers all common e-commerce features
- [x] Excellent performance and usability
- [x] Toolbox / framework for creating your own shop frontend

## Documentation
Run `npm run docs:dev` to see the developer documentation or take a look at `/docs`.

## Links
[Demo](https://hubble-pwa-demo.vercel.app/) |
[Website](https://www.hubblecommerce.io/de)

## Table of contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Features](#features)
- [Performance](#performance)
- [SEO friendly](#seo-friendly)
- [PWA](#pwa)
- [Specialized in Shopware 6](#specialized-in-shopware-6)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Support](#support)
- [Stay updated](#stay-updated)
- [Meta](#meta)

## Prerequisites
This guide focuses on installing hubble PWA as a Nuxt.js module only,
so before moving on, make sure you meet the [requirements](/pwa/what/requirements.html) first.

## Installation

1. Create a new Nuxt 3 Project
```sh
npx nuxi init nuxt-app
cd nuxt-app
npm install
```

2. Install the hubble Nuxt module
```sh
npm i @hubblecommerce/hubble
```

3. Add the module to nuxt.config.ts
```js
modules: ['@hubblecommerce/hubble']
```

4. Create a .env file in project root and fill credentials
```sh
API_SW_ACCESS_KEY = ''
API_BASE_URL      = ''
```
::: tip
Read more about where to get the credentials in the [supported e-commerce platforms](/pwa/what/requirements.html#supported-e-commerce-platforms) section.
:::

### Build modes

#### Development

```sh
npm run dev
```

#### Production

```sh
npm run build
node .output/server/index.mjs
```

## Features
hubble PWA is a Nuxt.js module.
That means it relies on all the great features of Nuxt.js like:
- All benefits of Vue 3 and Nuxt 3
- Server Side Rendering
- Dynamic Routing
- Code-Splitting
- Module Ecosystem (Composables)
- Intuitive Developer Experience
- Runtime Configuration

and enriches them to meet the demanding requirements of an e-commerce interface like:
- [Shop connector](/pwa/architecture/shop-connection.html) including an API client and data mapping (headless)
- [File-based inheritance (Theming)](/pwa/architecture/filebasedinheritance.html)
- [E-commerce optimized components](/pwa/architecture/components.html) like catalog, customer, checkout etc.
- [Integration path for shop-plugins (Compatibility Plugins)](/pwa/shopware/shopwareplugins.html)

This way hubble PWA can always be up-to-date to the fast-growing Nuxt.js ecosystem.

## Performance
We aim for an intuitive and smooth interface experience no matter how many features you build in your shop.
How we do it:
- everything that's not necessary for SEO purposes will be loaded lazily via chunking and dynamic imports
- uses as less global code as possible, everything is a Single-File-Component
- uses only relevant parts of a CSS framework (Tailwind CSS)
- measure performance with Google Lighthouse

## SEO friendly
All content that is relevant for SEO purposes will be rendered server-side thanks to Nuxt.js universal mode.
The rest will be loaded lazily to improve performance. <br>

We also take care of:
- Rich Snippets
- Google Tag Manager
- Enhanced e-commerce tracking

## PWA
To us, a PWA means more than the ability to add your website to home-screen or enable push notifications.
We want to make sure the interface actually feels like an intuitive, native app and hand you tools to achieve that like:
- Excellent performance on mobile devices
- Mobile first design approach
- User input feedback via decent animations and transitions

Besides, hubble of course is shipped with a simple service worker for offline support.
Feel free to adjust it to fit your caching approach needs.
Other PWA Features like "Add to Home" or "Push Notifications" can be installed easily
using the [official Nuxt.js PWA Module](https://pwa.nuxtjs.org/).

## Specialized in Shopware 6
Because hubble PWA was built for Shopware 6 primarily, it supports features like:
- [Emotion Worlds](/pwa/shopware/shopwareemotion.html)
- [Shopware Plugins via Compatibility Plugins](/pwa/shopware/shopwareplugins.html)
- [Shop configuration](/pwa/shopware/shopwareplugins.html#how-do-i-access-my-plugin-configurations)

## Roadmap
Thanks to the headless approach hubble is not tied to Shopware only,
so we are constantly working on connecting other e-commerce frameworks.
See our detailed [roadmap](/pwa/what/roadmap.html) for further information.

## Contributing

Specific instructions for pull requests can be found [here](pwa/contribution/contributionpwa.md).

## Support

If you like the hubble PWA, feel free to contribute and spread the word on social media.
Also don't forget to give us a star on Github.

## Stay updated

If you like to receive updates about updates and the latest releases just click on "watch" and select the information
you like to get noticed about.

## Meta

digital.manufaktur GmbH – hallo@digitalmanufaktur.com

Distributed under the MIT license. See [LICENSE](https://github.com/hubblecommerce/hubble-frontend-pwa/blob/main/LICENSE) for more information.
