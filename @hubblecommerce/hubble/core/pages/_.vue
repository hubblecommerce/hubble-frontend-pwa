<template>
    <div>
        <transition name="fade" appear>
            <component :is="currentComponent" v-if="pageType !== null" />
        </transition>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import apiResourceRequest from '~/anonymous-middleware/apiResourceRequest';

export default {
    name: 'RouteResolver',

    components: {
        ViewCategory: () => import('../components/productlist/ViewCategory'),
        ViewProduct: () => import('../components/productdetail/ViewProduct'),
        ViewContent: () => import('../components/cms/ViewContent'),
    },

    layout: 'hubble',

    data() {
        return {
            currentComponent: '',
        };
    },

    computed: {
        ...mapState({
            pageType: (state) => state.modApiResources.pageType,
        }),
    },

    created() {
        this.currentComponent = 'view-' + this.pageType;
    },

    middleware: [
        'apiAuthenticate',
        'apiLocalization',
        'apiResourceMenu',
        'apiResourceRoute',
        apiResourceRequest,
        'trackClickPath',
    ],

    transition: {
        name: 'page-transition',
        mode: 'out-in',
        css: false,
    },
};
</script>
