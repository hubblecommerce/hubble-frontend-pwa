# Configuration

## Nuxt.js Configuration

### Environment / Runtime Variables 
Environment specific variables are provides via 
[nuxts runtime configuration](https://v3.nuxtjs.org/api/composables/use-runtime-config#useruntimeconfig) based on the 
dotenv module.

All environment variables are placed in the platform specific config directory e.g.:
[Shopware .env_example](https://github.com/hubblecommerce/hubble-frontend-pwa/blob/hubble-next/src/platforms/shopware/config/.env_example)

### Modules 
hubble PWA sets some nuxt specific configurations like runtime variables and a [collection of modules](/pwa/architecture/preinstalledmodules.html), 
which can be found
in the platform specific directory e.g:
[Shopware configs](https://github.com/hubblecommerce/hubble-frontend-pwa/tree/hubble-next/src/platforms/shopware/config)
To override them, simply set the configuration you want to your nuxt.config.ts like you would in a regular nuxt project.
