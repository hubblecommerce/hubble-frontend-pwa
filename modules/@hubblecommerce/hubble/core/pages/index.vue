<template>
    <div class="index-container">
        <g-t-m-data-layer event="homepageLoaded" page-type="home" page-title="Hubble demo" :breadcrumbs="[{ '0': 'home' }]" />

        <component :is="currentComponent" />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import GTMDataLayer from '../components/utils/GTMDataLayer';
import apiIndexRoute from '~/anonymous-middleware/apiIndexRoute';

export default {
    name: 'Index',

    components: {
        ProductListing: () => import('../components/productlist/ProductListing'),
        ViewCategory: () => import('../components/productlist/ViewCategory'),
        GTMDataLayer,
    },

    layout: 'hubble',

    middleware: [apiIndexRoute, 'apiAuthenticate', 'apiLocalization', 'apiResourceMenu', 'trackClickPath'],

    data() {
        return {
            /*newProducts: [],
                inView: false,
                slider: {
                    options: {
                        responsive: {
                            0: {
                                items: 2,
                                mouseDrag: true,
                                controls: true
                            },
                            500: {
                                items: 3,
                                mouseDrag: true,
                                controls: true
                            },
                            1000: {
                                items: 5,
                                controls: true,
                                mouseDrag: false
                            }
                        }
                    }
                },*/
            currentComponent: '',
        };
    },

    created() {
        this.currentComponent = 'view-category';
    },

    methods: {
        ...mapActions({
            swGetCategoryProductsById: 'modApiCategory/swGetCategoryProductsById',
        }),
    },

    head() {
        let structuredDataLogo = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            url: process.env.APP_BASE_URL,
            logo: process.env.APP_BASE_URL + '/logo.png',
        };
        return {
            title: 'hubble Demo Store',
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { hid: 'description', name: 'description', content: 'hubble Demo Store' },
                { hid: 'robots', name: 'robots', content: 'INDEX, FOLLOW' },
                { hid: 'keywords', name: 'keywords', content: '' },
            ],
            script: [{ json: structuredDataLogo, type: 'application/ld+json' }],
        };
    },
};
</script>

<style lang="scss" scoped>
.index-text-wrp {
    margin-top: 12px;
}

.intro-headline {
    font-size: 25px;
    line-height: 25px;
    margin: 30px 20px 30px !important;
}

@media (min-width: 768px) {
    .index-text-wrp {
        margin-top: 30px;
    }

    .intro-headline {
        font-size: 45px;
        line-height: 45px;
        margin: 40px !important;
    }
}
</style>
