import Vue from 'vue';
import TransitionPopUp from '~/components/transitions/TransitionPopUp.vue';
import TransitionExpandLayer from '~/components/transitions/TransitionExpandLayer.vue';
import MaterialRipple from '~/components/utils/MaterialRipple';
import FlashMessages from '~/components/utils/FlashMessages';

import ImgLazy from '~/components/utils/ImgLazy.vue';
Vue.component('ImgLazy', ImgLazy);

Vue.component('TransitionPopUp', TransitionPopUp);
Vue.component('TransitionExpandLayer', TransitionExpandLayer);
Vue.component('MaterialRipple', MaterialRipple);
Vue.component('FlashMessages', FlashMessages);
