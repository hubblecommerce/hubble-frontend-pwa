# Configuration

## Nuxt.js Configuration

### Environment / Runtime Variables 
Environment specific variables are provided via 
[nuxts runtime configuration](https://v3.nuxtjs.org/api/composables/use-runtime-config#useruntimeconfig) based on the 
dotenv module.

All environment variables are placed in the hubble layer config directory e.g.:
[Shopware .env_example](https://github.com/hubblecommerce/hubble-frontend-pwa/blob/main/src/layer/config/.env_example)

### Modules 
hubble PWA sets some nuxt specific configurations like runtime variables and a [collection of modules](/pwa/architecture/preinstalledmodules.html), 
which can be found
in the layer config directory e.g:
[Config directory](https://github.com/hubblecommerce/hubble-frontend-pwa/tree/main/src/layer/config)
To override them, simply set the configuration you want to your nuxt.config.ts like you would in a regular nuxt project.
