# Shopware 6 Plugins

## How to install Shopware 6 Plugins on your hubble PWA?
1. Go to your SW6 admin and create an [Integration](https://docs.shopware.com/en/shopware-6-en/settings/system/integrationen?category=shopware-6-en/settings/system) so your PWA can communicate with your Shop programmatically.
2. Place the generated **API_CLIENT_ID** and **API_CLIENT_SECRET** in the _.env_ file of your PWA root directory.
3. Edit the package.json file of your PWA root directory and add following helper scripts: 
``` json
"scripts": {
    ...
    "sw:config-plugins": "hubble dev:sw sw-plugins-config",
    "sw:install-plugins": "hubble dev:sw sw-plugins-assets"
}
```

Now you are ready to install the Plugins of your Shopware 6 to your hubble PWA. Just execute the helper script on 
command line:
``` shell
npm run sw:config-plugins && npm run sw:install-plugins 
```

## How does my Shopware 6 Plugin have to be structured to work with hubble PWA?
The basic structure and PHP business logic integration does not differ from a normal Shopware 6 Plugin. 
The difference takes place only for your frontend related code. 
Instead of placing your frontend code in _src/Resources/app/storefront_ you place it in _src/Resources/app/pwa_.

Inside the pwa folder you use the Nuxt.js default directory structure:
- assets
- components
- composables
- layouts
- middleware
- pages
- store

::: warning 
Plugins are used to add new files and provide components to fill slots only. Plugins are not allowed to override 
existing files like you would do in your hubble PWA root directory (file based inheritance).
:::

## What is meant by slots?
The hubble PWA core code provides vue slots where you can hook in to add your plugin functionality. This way the hubble 
core stays independent, updatable and maintainable. Should you still miss a slot, you can use the file based inheritance 
mechanism to add a new slot which you can fill with your plugin component.

<img src="/assets/images/shopware_plugins-1@2x.jpg" alt="hubble PWA Shopware Plugin Slots" style="width: 100%;" />

## How to tell which component uses which slot?

<br>
<img src="/assets/images/shopware_plugins-2@2x.jpg" alt="hubble PWA Shopware Plugin Slot Mapping" style="width: 100%;" />

Simply place a pluginMapping.json in your plugins pwa directory and define a slot and component by name and a path to your component. The file should look something like this:

``` json
{
   "pluginSlots": [
       {
           "slot": "components-checkout-payment-method-description-after",
           "componentName": "my-plugin",
           "componentPath": "/components/my-plugin/MyPlugin.vue"
       },
       {
           "slot": "components-checkout-payment-modal",
           "componentName": "my-plugin-modal",
           "componentPath": "/components/my-plugin/MyPluginModal.vue"
       }
   ]
}
```

Corresponding slot in hubble looks like this:
_@hubblecommerce/hubble/dist/theme/components/checkout/CheckoutPayment.vue_

```vue
<MiscPluginSlot
    name="components-checkout-payment-method-description-after"
    :events="slotEvents"
    :data="{
        paymentMethods,
        method,
        selectedMethodId,
        showModal
    }"
/>
```

You can use the _data_ property for all properties your slot component expects. 
For register event-listeners you can use the _events_ property and pass event names and handlers to it. 

A collection of all used slots you can find in _/platform-plugins/pluginMapping.json_ of your projects root directory
(after installing plugins).

## How do I manage my plugin dependencies?
In this case you just need to add **a package.json in the pwa directory of your plugin** and define dependencies like you 
would in a normal npm based application. The installation script will recognize and install the dependencies you defined.

## How do I access my plugin configurations?
The plugin install script automatically dumps your plugin configurations directly from your Shopware 6 
(thanks to Shopware PWA Extension). It merges all those configs and places it in _/platform-plugins/pluginConfig.json_. 
On each build of your application the configurations are provided as runtimeConfigs.

The object key consists of the name of the plugin and the configuration key in camelcase.
For example: The programmatic name of your Plugin is “MySamplePlugin” and it has a configuration whose key is “active”, 
you would access it inside your component like this:
```js
const config = useRuntimeConfig()
const pluginIsActive = config.public.mySamplePluginActive
```

You can look up all the dumped configs in _/platform-plugins/pluginConfig.json_.

## What about configurations that shouldn't be exposed to the frontend?
If a configuration key contains the words "secret", "private" or "password" the configuration will be ignored to prevent exposing it to the frontend.
In case you want to include only specific config keys you can do so by creating a _/platform-plugins/pluginConfigWhitelist.json_ file.
The file should contain an array of configuration keys as strings. The configuration script will automatically only consider 
keys of the whitelist and generates the pluginConfig.json.

## I changed configuration of my plugin, but I can't see any changes
Everytime your configuration changes you have to dump and fetch them from your Shopware. 
To do this use the npm script [created before](/pwa/shopware/shopwareplugins.html#how-to-install-shopware-6-plugins-on-your-hubble-pwa): 

```sh
npm run sw:config-plugins
```

After the dump has finished, restart your application. A complete build is not necessary since runtimeConfigs are used.

## Payment Services
Configured payments are listed automatically in your checkout thanks to the PaymentMethods.vue component. But often
that's not enough, in case of payments where you have to enrich your order data with payment specific information.
For example: A customer selects the credit card payment method. Nowadays most Payment Service Providers need to render 
an iFrame to request the credit card data and returns you an id you need to store in your order data, so you don't have 
to handle credit card information by yourself.

In this case you need to:
- Render iFrame on Credit Card select
- Call the shop api and provide the ID received by the payment service provider (handle-payment)

To achieve that, hubble PWA provides you some useful slots and composables. Just have a look in the CheckoutPayment.vue and
the CheckoutPlaceOrder.vue components to see how it works. 

## Why the place order button is missing for specific payments?
Every payment method which is not shipped by Shopware 6 out of the box, need to render and handle the place order process
on its own. So maybe the payment plugin you installed doesn't provide any pwa related files. 

## Plugin skeleton example
- /Resources/app/pwa
  - /assets
  - /components
  - /composables
  - /layouts
  - /middleware
  - /pages
  - /store
  - package.json
  - pluginMapping.json
