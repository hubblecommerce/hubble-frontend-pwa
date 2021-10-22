# PWA for headless e-commerce
> High performant, intuitive and easy to develop progressive web app to connect with the api of your e-commerce systems API based on [Nuxt.js](https://nuxtjs.org/).

![GitHub package.json version](https://img.shields.io/github/package-json/v/hubblecommerce/hubble-frontend-pwa)
![GitHub contributors](https://img.shields.io/github/contributors/hubblecommerce/hubble-frontend-pwa)
![PWA Shields](https://www.pwa-shields.com/1.0.0/series/classic/solid/gray.svg)

✔ Integrated to Shopware 6 and possible with Magento, Magento 2, xt:Commerce, etc.  
✔ Contains all common pagetypes like: Category, Product Detail, Cart, Checkout, Customer Account, ...)  
✔ Excellent Google Lighthouse results in all audits  
✔ Toolbox / Boilerplate to create your own frontend 

## Installation

OS X & Linux:

1. Install [NuxtJS](https://nuxtjs.org/guides/get-started/installation)
2. Install hubble NuxtJs Module 
```sh
npm i @hubblecommerce/hubble --save-dev
```
3. Add module to nuxt.config.js
```js
buildModules: [
    ['@hubblecommerce/hubble']
]
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
API_BASE_URL      = ''
```

## Development setup

```sh
npm run dev
```

## Meta

digital.manufaktur GmbH – hallo@digitalmanufaktur.com

Distributed under the MIT license. See [LICENSE](https://github.com/hubblecommerce/hubble-frontend-pwa/blob/master/LICENSE.txt) for more information.

[https://github.com/hubblecommerce/hubble-frontend-pwa](https://github.com/hubblecommerce/hubble-frontend-pwa)

## Contributing

Detailed instructions to do pull requests can be found here:
[hubble Contribution Guide](https://docs.hubblecommerce.io/pwa/contribution/contributionpwa.html)

