<template>
    <div>
        <transition name="fade" appear>
            <component :is="currentComponent" v-if="pageType !== null" />
        </transition>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ViewCategory from '../components/productlist/ViewCategory';
import ViewProduct from '../components/productdetail/ViewProduct';
import ViewContent from '../components/cms/ViewContent';

export default {
    name: 'RouteResolver',

    components: {
        ViewCategory,
        ViewProduct,
        ViewContent,
    },

    layout: 'hubble',

    data() {
        return {
            currentComponent: '',
        };
    },

    computed: {
        ...mapState({
            pageType: state => state.modApiResources.pageType,
        }),
    },

    created() {
        this.currentComponent = 'view-' + this.pageType;
    },

    middleware: [
        'apiAuthenticate',
        'apiLocalization',
        'apiResourceMenu',
        'apiResourceProductUrls',
        'apiResourceRoute',
        'apiResourceRequest',
        'trackClickPath',
    ],

    transition: {
        name: 'page-transition',
        mode: 'out-in',
        css: false,
    },
};
</script>
