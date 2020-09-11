import Vue from 'vue';
import TransitionPopUp from '~/components/transitions/TransitionPopUp.vue';
import TransitionExpandLayer from '~/components/transitions/TransitionExpandLayer.vue';
import MaterialRipple from '~/components/utils/MaterialRipple';
import FlashMessages from '~/components/utils/FlashMessages';

import ImgLazy from '~/components/utils/ImgLazy.vue';
Vue.component('img-lazy', ImgLazy);

Vue.component('transition-pop-up', TransitionPopUp);
Vue.component('transition-expand-layer', TransitionExpandLayer);
Vue.component('material-ripple', MaterialRipple);
Vue.component('flash-messages', FlashMessages);
