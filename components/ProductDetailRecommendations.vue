<template>
    <div>
        <div class="product-carousel" v-if="!empty(productRelationsArr)">
            <div class="block-title">
                <strong><span class="headline3" v-text="$t('Related Products')"></span></strong>
            </div>
            <div class="wide-container">
                <product-listing :data-items="productRelationsArr" :is-slider="true"></product-listing>
            </div>
        </div>

        <!--@if(isset($product->item->related_product_ids['up_sell']) && count($product->item->related_product_ids['up_sell']))-->
        <!--@php-->
        <!--$dataUpsell = RocketCmsHelper::getProductsRelatedByIds($product->item->related_product_ids['up_sell']);-->
        <!--$statsUpsell = $dataUpsell['stats'];-->
        <!--$itemsUpsell = $dataUpsell['items'];-->
        <!--@endphp-->

        <!--<div id="product-slider-container" class="product-carousel">-->
            <!--<div class="block-title">-->
                <!--<strong><span class="headline3">@lang('product.upsell-products')</span></strong>-->
            <!--</div>-->
            <!--<div id="product-slider" class="wide-container">-->
                <!--<pwa-listing data-items="{{ json_encode($itemsUpsell) }}" :is-slider="true"></pwa-listing>-->
            <!--</div>-->
        <!--</div>-->
        <!--@endif-->

        <!--<div class="product-carousel" v-if="!empty(productUpsellings)">-->
            <!--<div class="block-title">-->
                <!--<strong><span class="headline3" v-text="$t('Upselling Products')"></span></strong>-->
            <!--</div>-->
            <!--<div class="wide-container">-->
                <!--&lt;!&ndash;<product-listing :data-items="productUpsellings" :is-slider="true"></product-listing>&ndash;&gt;-->
            <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "ProductDetailRecommandations",

        data() {
            return {
                productRelationsArr: []
            }
        },

        props: {
            productId: {
                type: Number,
                required: true
            }
        },

        computed: {
            ...mapState({
            	dataProductRelations: state => state.modApiResources.dataProductRelations.result.items,
            	dataProductUpsellings: state => state.modApiResources.dataProductUpsellings.result.items
            })
        },

        created() {
            this.$store.dispatch('modApiResources/getRelatedProducts', {
                data: this.productId
            }).then(response => {
                this.productRelationsArr = this.dataProductRelations;
            });
        },

        methods: {
            empty: function(p) {
                return _.isEmpty(p);
            }
        }
    }
</script>
