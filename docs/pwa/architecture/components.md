# Components
[See the components on github](https://github.com/hubblecommerce/hubble-frontend-pwa/tree/main/core/components)

<img src="/assets/images/components@2x.jpg" alt="hubble PWA Components" style="width: 100%;" />

## Disclaimer
Unlike other interface solutions hubble doesn't provide a full component ui library and that for a reason.
In our opinion most ui libraries aren't flexible enough and always produce an unnecessary overhead which
conflicts directly with our goal to serve the best performance possible. 

## Component Approach
When we create a component, we try to achieve things like look and feel just with plain HTML and CSS (SCSS) at first.
If that's not enough, because of a special business logic, we extract it to a Vue.js Single-File-Component.
We have experienced that a big part of e-commerce components appear again and again with different data but the 
same functionality (e.g. Navigation, Search, Listing, Filter, Add To Cart etc.). They differ only in their position
within the page or layout. So think hubble more as a collection of e-commerce tools than a component library. 
