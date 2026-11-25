# How to set up Shopware 6 to work with hubble PWA

1. Setup Shopware 6 (Version >= 6.6) your preferred way: [Shopware 6 installation overview](https://developer.shopware.com/docs/guides/installation/overview)
2. Install the [official Shopware 6 PWA plugin](https://github.com/elkmod/SwagShopwarePwa) (version 0.3.3).
This plugin provides useful API endpoints to make hubble PWA work with Shopware.
::: warning
The automatic asset-installation step this plugin used to provide (`npm run sw:install-plugins`) has been removed.
Plugin layers must now be set up manually, see [Shopware 6 Plugins](/pwa/shopware/shopwareplugins.html).
:::
3. After you successfully installed Shopware 6. Go to your Shopware 6 admin and create an [integration](https://docs.shopware.com/en/shopware-6-en/settings/system/integrationen?category=shopware-6-en/settings/system), 
so your PWA can communicate with your Shop programmatically. This is required if you want to install some Shopware 6
Plugins and make them work with hubble PWA. 
4. Last step is to get your Shopware 6 [API credentials](https://docs.shopware.com/en/shopware-6-en/settings/saleschannel#api-access).
You need those credentials to connect your hubble PWA to the correct Shopware 6 Sales-channel. 
5. Your Shopware 6 is now ready for your hubble PWA. [Continue with installing hubble PWA](/pwa/what/installation.html#install-from-scratch-including-fully-configured-nuxt-js-project). 
