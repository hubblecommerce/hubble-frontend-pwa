<template>
    <div>
        <transition name="fade">
            <component :is="curComponent" v-if="pageType !== null"></component>
        </transition>
    </div>
</template>

<script>
    import routeResolver from '@hubblecommerce/hubble/core/pages/routeResolver';
    import { mapState } from 'vuex';

    export default {
        name: "routeResolver",
        mixins: [routeResolver],

        layout: 'hubble',

        computed: {
            ...mapState({
                // dataUri: state => state.modApiResources.dataUri,
                // dataProduct: state => state.modApiResources.dataProduct,
                // dataCategory: state => state.modApiResources.dataCategory,
                // dataCategoryProducts: state => state.modApiResources.dataCategoryProducts,
                pageType: state => state.modApiResources.pageType
            }),
            curComponent() {
                return 'view-' + this.pageType;
            }
        },

        middleware: [
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'apiResourceRoute',
            'apiResourceRequest',
            'trackClickPath'
        ],

        transition: {
            name: 'page-transition',
            mode: 'out-in',
            css: false
        }
    }
</script>

