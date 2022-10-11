# i18n

For translations the module @intlify/nuxt3 is used.
The middleware `change-vue-locale.global.ts` sets the language depending on the
current localisation key of the url.

Following files are related to the translation process:
```text
/components
    /misc
        /MiscDefineLink.ts
        /MiscLink.vue
/locales
    /availableLocales.json
    /platformLanguages.json
/middleware
    /change-vue-locale.global.ts
/platforms
    /shopware
        /bin
            /sw-languages.js
        /composables
            /useLocalisation.ts
```

### Configuration
hubble sets some default configuration for intlify and vueI18n, to override them, they
have to be set via hubble module options.

#### redirectDefaultLanguage
If set true, all requests to the localised default route will redirect to the non localised route.
Default isset to false.

e.g.: default locale is 'de'. Requested page: domain.com/de/my-page will redirected to domain.com/my-page.

```js
export default defineNuxtConfig({
    hubble: {
        redirectDefaultLanguage: true,
        intlify: { // <= Override intlify module options
            vueI18n: { // <= Override vueI18n module options
                ...
            }
        }
    },
})
```

### MiscLink.vue
A custom component which uses defineNuxtLink in `/components/misc/MiscDefineLink.ts` to behave like a regular
NuxtLink, but take care of your current localized route.

IMPORTANT: For all links you have to use the MiscLink instead of NuxtLink.
Otherwise, users could land on a localised route with wrong languageId set and get 404 errors from Shopware.

### `locales/availableLocales.json`
Contains an array of language keys, used to generate localised routes of all available pages.
The first language is set as the default / fallback language.

### `locales/platformLanguages.json`
This file is created by the shopware helper script `/bin/sw-languages.js`.
It contains an array of objects of the response of /store-api/language of the configured Saleschannel / sw-access-key
in .env file.

To connect a localised route to a platform language, add a "route" to the objects in `platformLanguages.json`.

```js
[
    {
        "route": "de", // <= key from locales/availableLocales.json
        "id": "2fbb5fe2e29a4d70aa5854ce7ce3e20b",
        "code": "de-DE",
        "name": "Deutsch"
    },
    {
        "route": "en",
        "id": "669293859c85406c832315184f775f0c",
        "code": "en-GB",
        "name": "Englisch"
    }
]
```

IMPORTANT: Make sure you set the languages in the saleschannels settings and created a domain
which uses the language, otherwise Shopware won't generate the seo urls for the requested language id.

## How to Multilanguage with Shopware 6
1. Add the required language in Admin -> Settings -> Languages
2. Add the new language to your Sales-Channel in Sales-Channel -> Base Settings -> Languages
3. Assign the language to an existing domain of your Sales-Channel or create a new domain
4. Create a `/locales/availableLocales.json` file and define the languages you want to provide
5. Download and save all languages available for your Sales-Channel from Shopware by execute this script in your projects root dir:
```shell
npm run hubble dev:sw sw-languages
```
6. Edit the created `locales/platformLanguages.json` file and assign an available locale to
   a downloaded language by adding a "route" key and the language key as a value. 
