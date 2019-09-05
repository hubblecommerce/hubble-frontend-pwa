import Vue from 'vue';
import Collapsible from '../components/Collapsible.vue';
import CollapsibleFilter from '../components/CollapsibleFilter.vue';
import TransitionPopUp from '../components/TransitionPopUp.vue';
import TransitionExpandLayer from '../components/TransitionExpandLayer.vue';
import ProductListing from '../components/ProductListing.vue';
import ProductListingCard from '../components/ProductListingCard.vue';
import ProductListingFilter from '../components/ProductListingFilter.vue';
import PriceSlider from '../components/PriceSlider.vue';
import MaterialRipple from '../components/MaterialRipple';
import ProductListingCardOptions from '../components/ProductListingCardOptions';
import ProductDetailBuyboxOptions from '../components/ProductDetailBuyboxOptions';
import FlashMessage from '../components/FlashMessage';
import TheHubbleSwitch from '../components/TheHubbleSwitch';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

import ViewAuth from '../components/ViewAuth.vue';
import ViewDummy from '../components/ViewDummy.vue';
import ViewProduct from '../components/ViewProduct.vue';
import ViewCategory from '../components/ViewCategory.vue';
import ViewCatalogsearch from '../components/ViewCatalogsearch.vue';

import ImgLazy from '../components/ImgLazy.vue';
Vue.component('img-lazy', ImgLazy);

Vue.component('collapsible', Collapsible);
Vue.component('collapsible-filter', CollapsibleFilter);
Vue.component('transition-pop-up', TransitionPopUp);
Vue.component('transition-expand-layer', TransitionExpandLayer);
Vue.component('product-listing', ProductListing);
Vue.component('product-listing-card', ProductListingCard);
Vue.component('product-listing-filter', ProductListingFilter);
Vue.component('price-slider', PriceSlider);
Vue.component('material-ripple', MaterialRipple);
Vue.component('product-listing-card-options', ProductListingCardOptions);
Vue.component('product-detail-buybox-options', ProductDetailBuyboxOptions);
Vue.component('flash-message', FlashMessage);
Vue.component('hubble-switch', TheHubbleSwitch);
Vue.component('login-form', LoginForm);
Vue.component('register-form', RegisterForm);

Vue.component('view-auth', ViewAuth);
Vue.component('view-dummy', ViewDummy);
Vue.component('view-product', ViewProduct);
Vue.component('view-category', ViewCategory);
Vue.component('view-catalogsearch', ViewCatalogsearch);

// prototype vue event bus
Vue.prototype.$bus = new Vue();
