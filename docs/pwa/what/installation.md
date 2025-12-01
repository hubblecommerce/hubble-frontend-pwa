# Installation

## Prerequisites
This guide focuses on installing hubble PWA as a Nuxt.js module only,
so before moving on, make sure you meet the [requirements](/pwa/what/requirements.html) first.

## Installation 

1. Create a new Nuxt 4 Project
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
```ts
export default defineNuxtConfig({
    modules: [
        '@hubblecommerce/hubble'
    ]
})
```

4. Create a .env file in project root and fill your Shopware 6 credentials
```sh
PLATFORM_BASE_URL       = 'https://your-shopware-store.com'
API_BASE_URL            = 'https://your-shopware-store.com/store-api'
API_SW_ACCESS_KEY       = 'your-sales-channel-access-key'
API_CLIENT_ID           = 'your-client-id'
API_CLIENT_SECRET       = 'your-client-secret'
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
