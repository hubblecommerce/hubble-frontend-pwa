# Installation

## Prerequisites
This guide focuses on installing hubble PWA as a Nuxt.js module only,
so before moving on, make sure you meet the [requirements](/pwa/what/requirements.html) first.

## Installation 

1. Create a new Nuxt 3 Project
```sh
npx nuxi init nuxt-app
cd nuxt-app
npm install

# Resolve pinia dependency issue 
npm i pinia -f
```

2. Install the hubble Nuxt module
```sh
npm i @hubblecommerce/hubble
```

3. Add the module to nuxt.config.ts
```js
modules: [
    '@hubblecommerce/hubble'
]
```

4. Create a .env file in project root and fill credentials
```sh
PLATFORM                = 'shopware'
PLATFORM_BASE_URL       = ''
API_BASE_URL            = ''
API_SW_ACCESS_KEY       = ''
API_CLIENT_ID           = ''
API_CLIENT_SECRET       = ''
```
::: tip
Read more about where to get the credentials in the [supported e-commerce platforms](/pwa/what/requirements.html#supported-e-commerce-platforms) section.
:::

## Build modes

### Development

```sh
npm run dev
```

### Production

```sh
npm run build
node .output/server/index.mjs
```
