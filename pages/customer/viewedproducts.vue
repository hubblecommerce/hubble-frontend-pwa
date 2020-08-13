<template>
    <div class="container">
        <client-only>
            <div v-if="viewedProducts.length">
                <last-viewed-products :number-of-items="maxSaved" />
            </div>
            <div v-else>
                <nuxt-link :to="localePath('index')">
                    <button class="button-primary">
                        {{ $t('Discover our products') }}
                        <material-ripple />
                    </button>
                </nuxt-link>
            </div>
        </client-only>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "ViewedProductsPage",

        layout: 'hubble',

        components: {
            LastViewedProducts: () => import(/* webpackChunkName: "LastViewedProductsChunk" */ "../../components/productutils/LastViewedProducts"),
        },

        computed: {
            ...mapState({
                viewedProducts: state => state.modLastViewed.viewedProducts,
                maxSaved: state => state.modLastViewed.maxSaved
            })
        },

        middleware: [
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],
        head() {
            return {
                title: this.$t('Your Last Viewed Products'),
                meta: [
                    { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }
                ]
            }
        }
    }
</script>
