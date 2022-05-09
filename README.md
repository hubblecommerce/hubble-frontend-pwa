<br>
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

## Contributing

Specific instructions for pull requests can be found [here](https://docs.hubblecommerce.io/pwa/contribution/contributionpwa.html).

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
