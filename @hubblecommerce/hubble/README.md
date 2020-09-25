# Next Generation Shopfrontend
> Hochperformante Progressive Web App für jede gängige E-Commerce Plattform auf Basis von [Nuxt.js](https://nuxtjs.org/).

![GitHub package.json version](https://img.shields.io/github/package-json/v/hubblecommerce/hubble-frontend-pwa)
![GitHub contributors](https://img.shields.io/github/contributors/hubblecommerce/hubble-frontend-pwa)
![David](https://img.shields.io/david/hubblecommerce/hubble-frontend-pwa)
![PWA Shields](https://www.pwa-shields.com/1.0.0/series/classic/solid/gray.svg)

✔ Shop Integration mit Magento, Magento 2, Shopware, xt:Commerce, etc.  
✔ Enthält alle gängigen Shop Seitenarten (Kategorie, Detailansicht, Warenkorb, Zur Kasse, etc.)  
✔ Exzellente Google Lighthouse Ergebnisse in allen Audits  
✔ Toolbox / Framework zum Erstellen eigener Shop Frontends 

## Installation

OS X & Linux:

1. Install [NuxtJS](https://nuxtjs.org/guides/get-started/installation)
2. Install hubble NuxtJs Module 
```sh
npm i @hubblecommerce/hubble
```
3. Add module to nuxt.config.js
```js
buildModules: [
    ['@hubblecommerce/hubble']
],

/*
 ** hubble module configuration
 */
hubble: {
    apiType: process.env.API_TYPE
},
```
4. Edit configs in .env file
```sh
# API
# Define api type:
# possible source parameters are:
# api = hubble Api based on elastic search
# sw = official Shopware 6 API (headless Channel)
API_TYPE          = 'sw | api'
API_SW_ACCESS_KEY = ''
```

## Development setup

```sh
npm run dev
```

## Release History

* 1.0.0
    * The first proper release

## Meta

digital.manufaktur GmbH – hallo@digitalmanufaktur.com

Distributed under the MIT license. See [LICENSE](https://github.com/hubblecommerce/hubble-frontend-pwa/blob/master/LICENSE.txt) for more information.

[https://github.com/hubblecommerce/hubble-frontend-pwa](https://github.com/hubblecommerce/hubble-frontend-pwa)

## Contributing

Eine spezifische Anleitung für Pull Requests ist hier zu finden:
[hubble Contribution Guide](gettingstarted/contribution.md)

