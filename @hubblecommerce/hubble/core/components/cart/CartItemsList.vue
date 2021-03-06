<template>
    <div class="cart-items-list-wrp container">
        <div v-for="item in items" :key="item.id" class="row cart-item">
            <nuxt-link :to="'/' + item.url_pds" class="col-8">
                <div class="row">
                    <div class="col-4">
                        <img
                            :src="item.image"
                            class="product-img img-minicart"
                            alt="Product Image"
                            :title="item.name_orig"
                        />
                    </div>

                    <div class="col-8">
                        <div class="container">
                            <div class="row">
                                <span class="product-name" v-text="item.name_orig" />
                            </div>

                            <div class="row">
                                <ul class="selected-variants-wrp">
                                    <li v-for="(variant, key) in item.variants" :key="key" class="selected-variants" >
                                        {{ variant.label }}: {{ variant.value_label }}
                                    </li>
                                </ul>
                            </div>

                            <div class="row">
                                <span class="product-price old-price" v-text="formatPrice(item.final_price_item.display_price_brutto)" />
                                <span class="product-price sale-price" v-text="formatPrice(item.final_price_item.display_price_brutto)" />
                            </div>
                        </div>
                    </div>
                </div>
            </nuxt-link>

            <div v-if="interactive" class="col-4 actions-wrp text-right">
                <div aria-hidden="true" class="remove-item" @click="removeItem(item)" v-text="'Remove'" />

                <qty-selector
                    :type="true"
                    :min-qty="item.qty"
                    :max-qty="item.stock_item.maxPurchase"
                    @changeQty="onChangeQty(item, $event)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import ApiClient from "@/utils/api-client";

export default {
    name: 'CartItemsList',

    data() {
        return {
        };
    },

    props: {
        items: {
            type: Array,
            required: true
        },
        interactive: {
            type: Boolean,
            required: false,
            default: true
        }
    },

    computed: {
        ...mapState({
            offcanvas: (state) => state.modNavigation.offcanvas,
            contextToken: (state) => state.modSession.contextToken
        })
    },

    methods: {
        ...mapActions({
            updateItem: 'modCart/updateItem',
            delItem: 'modCart/delItem',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
        ...mapMutations({
            setCart: 'modCart/setCart',
        }),
        removeItem: async function (item) {
            let response = await new ApiClient().apiCall({
                action: 'delete',
                endpoint: 'store-api/v3/checkout/cart/line-item',
                contextToken: this.contextToken,
                data: {
                    ids: [item.id]
                }
            });

            return this.$emit('items-list-changed', response);
        },
        formatPrice: function(price) {
            const formatter = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2
            });

            return formatter.format(price);
        },
        onChangeQty: async function (item, qty) {
            let response = await new ApiClient().apiCall({
                action: 'patch',
                endpoint: 'store-api/v3/checkout/cart/line-item',
                contextToken: this.contextToken,
                data: {
                    items: [
                        {
                            id: item.id,
                            quantity: qty,
                            referencedId: item.referencedId
                        }
                    ]
                }
            });

            return this.$emit('items-list-changed', response);
        },
        getStockQtyOfVariant: function (item) {
            // If product has no variants return 10
            return 10;
        }
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

$hbl-cart-item-image-size: 60px;
$hbl-cart-item-image-size-md: 100px;

.cart-item {
    border-bottom: 1px solid $border-color;
    padding-top: 10px;
    padding-bottom: 10px;

    &:last-child {
        border-bottom: none;
    }

    img {
        margin: auto;
        display: block;
    }

    .actions-wrp {
        margin-bottom: auto;

        .remove-item {
            font-weight: $font-weight-bold;
            text-transform: uppercase;
            text-decoration: underline;
            text-align: right;
            margin-bottom: 45px;
            cursor: pointer;
        }

        .quantity-selector {
            max-width: none;
            width: 100%;
            text-align: right;

            .hbl-select,
            .hbl-input-group {
                width: 75px;
                margin-bottom: 0;

                .hbl-select,
                .hbl-input-group {
                    width: 65px;
                    margin-top: 40px;
                    margin-left: auto;

                    input {
                        text-align: center;
                    }

                    .select-label {
                        display: none;
                    }
                }
            }
        }
    }

    .img-minicart {
        max-width: $hbl-cart-item-image-size !important;
        max-height: $hbl-cart-item-image-size !important;
    }

    .product-name {
        @include font-size($text-font-sizes);
        margin-bottom: 10px;
    }

    .selected-variants-wrp {
        padding: 0;
    }

    .selected-variants {
        list-style: none;
        @include font-size($text-font-sizes);
    }

    .product-price,
    .product-qty,
    .separator {
        @include font-size($text-font-sizes);
        font-weight: $font-weight-bold;
    }

    .old-price {
        font-weight: 400;
        text-decoration: line-through;

        & + .sale-price {
            color: $error-accent;
            margin-left: 15px;
        }
    }

    &.coupon {
        display: flex;
        justify-content: space-between;
        border-bottom: none;

        .coupon-val {
            min-width: 100px;
            text-align: right;
        }
    }
}

/* Tablet */
@media (min-width: 768px) {
    .cart-item {
        padding: 25px 0;

        &.coupon {
            padding: 15px;
        }
    }
}
</style>
