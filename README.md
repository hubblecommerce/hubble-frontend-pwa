<br>

<img src="https://docs.hubblecommerce.io/assets/images/hubblelogo.svg" style="height:50px" />

# Headless E-Commerce Interface
> Progressive Web App for your online store based on [Nuxt.js](https://nuxtjs.org/)

- [x] An open source project
- [x] Installable as a Nuxt.js Module
- [x] Compatible with Shopware 6
- [x] Covers all common e-commerce features
- [x] Excellent performance and usability
- [x] Toolbox / framework for creating your own shop frontend

## Links
[Demo](https://demo.hubblestudio.io/) |
[Documentation](https://docs.hubblecommerce.io/pwa/what/overview.html#features) |
[Website](https://www.hubblecommerce.io/de)

## Table of contents
- [Requirements](#requirements)
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

## Requirements
- [Shopware >= 6.4.0](https://developer.shopware.com/docs/guides/installation)
- [Shopware 6 PWA Plugin](https://github.com/elkmod/SwagShopwarePwa)
- [API Credentials](https://docs.shopware.com/en/shopware-6-en/settings/saleschannel#api-access) to your online store
- Node >= v14.18.1

## Installation

### Install from scratch including fully configured Nuxt.js project

Install via npx so everything is set up correctly and ready to use. The script prompts you to enter the
[access data](https://docs.shopware.com/en/shopware-6-en/settings/saleschannel#api-access) for the api:
```sh
npx @hubblecommerce/launcher <project-name>
```
or enter your API url and key directly as additional parameters:
```sh
npx @hubblecommerce/launcher <project-name> <api-url> <api-key>
```

### Install to existing Nuxt.js project

1. Install hubble NuxtJs Module
```sh
npm i @hubblecommerce/hubble
```

2. Add module to nuxt.config.js
```js
modules: [
    ['@hubblecommerce/hubble']
],
```

Module have to be registered in **modules**, not **buildModules** to make sure runtime configurations work.

3. Edit configs in .env file
```sh
API_SW_ACCESS_KEY = ''
API_BASE_URL      = ''
```

## Build modes

### Development

```sh
npm run dev
```

### Production

```sh
npm run build
npm start
```

## Features
hubble PWA is a Nuxt.js module.
That means it relies on all the great features of Nuxt.js like:
- All benefits of Vue.js
- Server Side Rendering
- Dynamic Routing
- Code-Splitting
- Module Ecosystem
- Intuitive Developer Experience
- Runtime Configuration

and enriches them to meet the demanding requirements of an e-commerce interface like:
- [Shop connector](https://docs.hubblecommerce.io/pwa/architecture/shop-connection.html) including an API client and data mapping (headless)
- [File-based inheritance (Theming)](https://docs.hubblecommerce.io/pwa/architecture/filebasedinheritance.html)
- [E-commerce optimized components](https://docs.hubblecommerce.io/pwa/architecture/components.html) like catalog, customer, checkout etc.
- [Integration path for shop-plugins (Compatibility Plugins)](https://docs.hubblecommerce.io/pwa/shopware/shopwareplugins.html)

This way hubble PWA can always be up-to-date to the fast-growing Nuxt.js ecosystem.

## Performance
We aim for an intuitive and smooth interface experience no matter how many features you build in your shop.
How we do it:
- everything that's not necessary for SEO purposes will be loaded lazily via chunking and dynamic imports
- uses as less global code as possible, everything is a Single-File-Component
- uses only relevant parts of a CSS framework (Bootstrap)
- stores only a few small data in state-management
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
- [Emotion Worlds](https://docs.hubblecommerce.io/pwa/shopware/shopwareemotion.html)
- [Shopware Plugins via Compatibility Plugins](https://docs.hubblecommerce.io/pwa/shopware/shopwareplugins.html)
- [Shop configuration](https://docs.hubblecommerce.io/pwa/shopware/shopwareplugins.html#how-do-i-access-my-plugin-configurations)

## Roadmap
Thanks to the headless approach hubble is not tied to Shopware only,
so we are constantly working on connecting other e-commerce frameworks.
See our detailed [roadmap](https://docs.hubblecommerce.io/pwa/what/roadmap.html) for further information.

## Contributing

Specific instructions for pull requests can be found [here](https://docs.hubblecommerce.io/pwa/contribution/contributionpwa.md).

## Support

If you like the hubble PWA, feel free to contribute and spread the word on social media.
Also don't forget to give us a star on github.

## Stay updated

If you like to receive updates about updates and the latest releases just click on "watch" and select the information
you like to get noticed about.

## Meta

digital.manufaktur GmbH – hallo@digitalmanufaktur.com

Distributed under the MIT license. See [LICENSE](https://github.com/hubblecommerce/hubble-frontend-pwa/blob/master/LICENSE.txt) for more information.

[https://github.com/hubblecommerce/hubble-frontend-pwa](https://github.com/hubblecommerce/hubble-frontend-pwa)
