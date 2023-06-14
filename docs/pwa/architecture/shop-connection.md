# Shop Connector

<img src="/assets/images/shop_connector@2x.jpg" alt="hubble PWA Shop Connector" style="width: 100%;" />

## Configuration
You can configure the platforms credentials like api base url and access-key in the .env file.
For all available configs take a look in the 
[platform specific config directory](https://github.com/hubblecommerce/hubble-frontend-pwa/tree/hubble-next/src/platforms/shopware/config)


Shopware 6 example .env: 
```
APP_BASE_URL            = 'http://localhost:3000'

PLATFORM                = 'shopware'
PLATFORM_BASE_URL       = 'http://my-shopware'
API_BASE_URL            = 'http://my-shopware/store-api'
API_SW_ACCESS_KEY       = 'XXXXXXXXXXXXXXX'
API_CLIENT_ID           = 'XXXXXXXXXXXXXXX'
API_CLIENT_SECRET       = 'XXXXXXXXXXXXXXX'

# Shopware Config
SW_PAYMENT_FINISH_URL   = 'http://localhost:3000/checkout/success'
SW_PAYMENT_ERROR_URL    = 'http://localhost:3000/checkout/error'
```

## Composables
To fetch data from your e-commerce system, hubble provides you a bunch of composables which uses a platform specific
api client and maps the responses in a typed and generalized format. 

You can find all available composables inside the platform specific directory:
_node_modules/@hubblecommerce/hubble/dist/platforms/[PLATFORM]/composables_

### Usage
For example to fetch and show the current users cart:
```vue
<template>
    <div v-if="loading">
        Loading cart...
    </div>
    <div v-else-if="error && !loading">
        An error occurred: {{ error }}
    </div>
    <div v-else-if="!loading && !error">
        {{ cart }}
    </div>
</template>

<script setup lang="ts">
const cartStore = useCart() // No import needed, composable is auto-imported by Nuxt 
const { cart, loading, error } = storeToRefs(cartStore) // States to be used to display in template 
const { getCart, deleteCart } = cartStore // functions to manipulate cart  
</script>
```

## API Client
Should you want to access your platform api directly nevertheless, you can write your own composable and use the platform 
specific api-client by yourself.

You can find the api client here:
_node_modules/@hubblecommerce/hubble/dist/platforms/[PLATFORM]/api-client_

## Data mapping
To simply fetch data from the api is not enough because our components expect a different data schema.
Therefore, the response data need to be mapped first. 

Every api client provides its specific mapping helper functions:
_node_modules/@hubblecommerce/hubble/dist/platforms/[PLATFORM]/utils/mapping/dataMapping.ts_

They map the api responses to the common types our components expect:
_node_modules/@hubblecommerce/hubble/dist/commons/utils/types_

