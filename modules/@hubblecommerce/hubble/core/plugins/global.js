import Vue from 'vue';
import Collapsible from '../components/utils/Collapsible.vue';
import TransitionPopUp from '../components/transitions/TransitionPopUp.vue';
import TransitionExpandLayer from '../components/transitions/TransitionExpandLayer.vue';
import MaterialRipple from '../components/utils/MaterialRipple';
import FlashMessages from '../components/utils/FlashMessages';

import ImgLazy from '../components/utils/ImgLazy.vue';
Vue.component('img-lazy', ImgLazy);

Vue.component('collapsible', Collapsible);
Vue.component('transition-pop-up', TransitionPopUp);
Vue.component('transition-expand-layer', TransitionExpandLayer);
Vue.component('material-ripple', MaterialRipple);
Vue.component('flash-message', FlashMessages);

// prototype vue event bus
Vue.prototype.$bus = new Vue();
