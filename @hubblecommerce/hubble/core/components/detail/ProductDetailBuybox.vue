<template>
    <div class="product-info-wrp">
        <!-- Header -->
        <div class="product-headline">
            <product-detail-manufacturer :data-product="dataProduct" />
            
            <div class="product-headline-info">
                <h1 class="product-name headline-4" v-text="dataProduct.name" />
                <div v-if="dataProduct.sku" class="sku" v-text="`SKU: ${dataProduct.sku}`" />
            </div>
        </div>

        <!-- Price info -->
        <product-detail-price :item="dataProduct" />

        <!-- Delivery info -->
        <product-detail-delivery :item="dataProduct" />

        <!-- Variants -->
        <div v-if="itemIsConfigurable && dataProduct.options" class="variants-wrp">
            <lazy-product-detail-buybox-options :data-product="dataProduct" />
        </div>

        <!-- Add to cart -->
        <div v-if="dataProduct.stock_item.is_in_stock" class="add-to-cart-wrp">
            <qty-selector
                :min-qty="dataProduct.stock_item.minPurchase"
                :max-qty="dataProduct.stock_item.maxPurchase != null ? dataProduct.stock_item.maxPurchase : 10"
                @changeQty="onChangeQty($event)"
            />
            <product-detail-add-to-cart :qty="qty" :data-product="dataProduct" />
        </div>
        <div v-else class="out-of-stock-wrp">
            {{ 'We are sorry, this product is currently out of stock.' }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductDetailBuybox',

    props: {
        dataProduct: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            name: 'ProductDetailBuybox',
            qty: 1,
        };
    },

    computed: {
        itemIsConfigurable: function () {
            return this.dataProduct.type === 'configurable';
        },
    },

    methods: {
        onChangeQty: function (e) {
            this.qty = e;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.product-info-wrp {
    position: relative;

    .product-headline {
        padding: 20px 0 0;
        margin-bottom: 15px;
        width: 100%;

        .product-headline-info {
            margin-top: 30px;
        }
    }

    .product-name {
        padding: 0;
        margin-top: 5px;
        margin-bottom: 3px;
        max-width: 100% !important;
        font-size: 18px;
    }

    .options-wrp {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .variants-wrp {
        margin-bottom: 20px;
    }

    .selected-variant {
        font-weight: $font-weight-regular;
    }

    .variant-label {
        display: inline;
    }

    .variant-list {
        list-style: none;
        display: flex;
        flex-flow: wrap;
        padding-left: 0;
        margin-bottom: 0;

        li {
            cursor: pointer;

            &.unavailable {
                cursor: not-allowed;
            }
        }
    }

    .option-val {
        border: 1px solid $border-color;
        padding: 8px 15px;
        margin: 10px 10px 10px 0;
        min-width: 64px;
        text-align: center;
    }

    .unavailable {
        opacity: 0.3;
    }

    .selected {
        border-color: $accent;
    }

    .description-link {
        display: block;
        width: 100%;
        border-bottom: 1px solid $border-color;
        padding: 0 0 20px;
        margin-bottom: 20px;
    }

    .brand {
        text-align: right;

        img {
            max-width: 55px;
        }
    }

    .filtered-products-link-wrp {
        padding: 0 10px 5px 10px;
        display: flex;
        flex-direction: column;

        .filtered-products-link {
            margin-bottom: 15px;
        }
    }

    .add-to-cart-wrp {
        display: flex;
        height: 58px;
        margin-bottom: 40px;

        .quantity-selector {
            margin-right: $base-padding;
        }

        .add-to-cart {
            width: 100%;
        }
    }
}

@media (min-width: 768px) {
    .product-info-wrp {
        .product-headline {
            padding-top: 0;
            padding-left: 0;
            padding-right: 0;
            align-items: flex-start;

            .sku {
                font-size: 12px;
            }
        }

        .description-link {
            padding: 0 0 20px;
        }

        .filtered-products-link-wrp {
            padding: 0;
            flex-direction: row;
            margin-top: 40px;

            .filtered-products-link {
                margin: 0 40px 0 0;

                &:last-child {
                    margin: 0;
                }
            }
        }

        .add-to-cart-wrp {
            .add-to-cart {
                width: 90%;
            }
        }
    }
}

@media (min-width: 1024px) {
    .product-info-wrp {
        .product-name {
            font-size: 31px;
            line-height: 36px;
        }

        .product-headline {
            margin-bottom: 30px;

            .add-to-wishlist-wrp {
                position: absolute;
                right: 0;
                top: 0;
            }

            .sku {
                font-size: 14px;
                color: $dark-gray;
            }
        }
    }
}
</style>
