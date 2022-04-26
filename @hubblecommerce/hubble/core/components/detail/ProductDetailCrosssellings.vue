<template>
    <div class="detail-crosssellings-inner">
        <div v-for="item in items" class="sw-product-slider">
            <template v-if="item.products && item.products.length">
                <div v-if="item.crossSelling.name" class="sw-product-slider-title">
                    <h2 v-text="item.crossSelling.name" />
                </div>

                <hooper :settings="sliderSettings" style="height: auto">
                    <slide v-for="(dataItem, index) in mappingProducts(item.products)" :key="index" :index="index" :class="`sw-product-slider-item`">
                        <product-listing-card :item-data="dataItem" :show-desc="false" :show-badges="true" />
                    </slide>
                    <hooper-navigation slot="hooper-addons"></hooper-navigation>
                </hooper>
            </template>
        </div>
    </div>
</template>

<script>
import { Hooper, Slide, Navigation as HooperNavigation } from 'hooper';
import { mapState } from 'vuex';
import ApiClient from '@/utils/api-client';
import 'hooper/dist/hooper.css';
import { mappingCategoryProducts } from '@/utils/api-mapping-helper';

export default {
    name: 'ProductDetailCrosssellings',

    components: {
        Hooper,
        Slide,
        HooperNavigation,
    },

    props: {
        productId: {
            type: String,
            required: false,
            default: ''
        },
        crossSellings: {
            type: Array,
            required: false,
            default: () => []
        }
    },

    data() {
        return {
            items: [],
            isLoading: true,
            sliderSettings: {
                itemsToShow: 1,
                wheelControl: false,
                keysControl: false,
                mouseDrag: false,
                infiniteScroll: true,
                breakpoints: {
                    376: {
                        itemsToShow: 2,
                    },
                    768: {
                        itemsToShow: 3,
                    },
                    1024: {
                        itemsToShow: 4,
                    },
                },
            },
        };
    },

    async mounted() {
        if (!this.crossSellings && this.productId !== '') {
            try {
                const crossSellingResponse = await this.fetchCrossSellings();
                this.items = crossSellingResponse.data;
            } catch (e) {
                console.log(e);
            }
        } else {
            this.items = this.crossSellings;
        }
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        })
    },

    methods: {
        fetchCrossSellings: async function () {
            try {
                return await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: `store-api/product/${this.productId}/cross-selling`,
                    contextToken: this.contextToken,
                    headers: [{ 'sw-include-seo-urls': true }],
                });
            } catch (e) {
                console.log(e);
            }
        },
        mappingProducts: function(products) {
            return mappingCategoryProducts(products);
        }
    },
};
</script>

<style lang="scss">
$gap: 10px;

.detail-crosssellings-inner {
    .sw-product-slider {
        .sw-product-slider-title {
            margin-bottom: 20px;
        }
    }

    .hooper {
        width: calc(100% + 2 * #{$gap});
        margin-left: -$gap;
        margin-right: -$gap;

        .hooper-slide {
            padding: 0 $gap;
        }
    }
}
</style>
