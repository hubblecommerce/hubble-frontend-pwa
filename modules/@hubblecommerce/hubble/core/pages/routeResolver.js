import { mapState } from 'vuex';

export default {
    name: "routeResolver",

    layout: (context) => context.isMobile ? 'mobile' : 'desktop',

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
        'hubbleware'
    ],

    transition: {
        name: 'page-transition',
        mode: 'out-in',
        css: false
    }
}
