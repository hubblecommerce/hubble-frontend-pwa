# Pages
[See the pages on github](https://github.com/hubblecommerce/hubble-frontend-pwa/tree/hubble-next/src/theme/pages)

<img src="/assets/images/page@2x.jpg" alt="hubble PWA Pages" style="width: 100%;" />

## Static Routes 

Use the usual nuxt [file-based routing](https://v3.nuxtjs.org/guide/directory-structure/pages) to generate the static routes.
hubble uses static page routes for the following page types:
- Checkout Pages  
- Customer Pages
- Cart
- Home
- Search Result Page

## Dynamic Routes

If the requested route is not a static route, the 
[dynamic route](https://v3.nuxtjs.org/guide/directory-structure/pages#dynamic-routes) component _/pages/[...slug].vue_ takes effect. 
This component fetches the requested route from the API and resolves dynamically to components.

hubble uses dynamic page routes for the following page types:
- Category / Product Listing
- Product Detail Page 
- CMS Page

## Dynamic Page Structure 
The dynamic page resolves dynamic components and assumes the provided data to have a specific format we call the _structure_.

- A _structure_ consists of _sections_
- _sections_ consists of _blocks_
- _blocks_ consists of _slots_
- _slots_ display the corresponding data directly or via a reusable _component_ 

### Default Structures
Platforms like Shopware 6 provide such generic data with their Emotionworlds. In case of your platform doesn't provide 
structural data for requested pages and only response entities' data, hubble comes with some 
[default structures](https://github.com/hubblecommerce/hubble-frontend-pwa/blob/hubble-next/src/runtime/commons/utils/useDefaultStructure.ts) 
for the most common page types.

#### Example for set default structure entity / page type:

```js
if (mappedPage.structure === null) {
    const {
        hblSetDefaultStructures,
        hblGetDefaultStructureByType
    } = hblUseDefaultStructure()
    hblSetDefaultStructures()
    mappedPage.structure = hblGetDefaultStructureByType(mappedPage.type)
}
```
