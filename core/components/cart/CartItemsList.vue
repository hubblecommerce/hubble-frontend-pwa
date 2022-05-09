<template>
    <div class="cart-items-list-wrp container">
        <div v-for="item in items" :key="item.id" class="row cart-item">
            <template v-if="item.type === 'product'">
                <nuxt-link :to="getProductUrl(item.url_pds)" class="col-8">
                    <div class="row">
                        <div class="col-4">
                            <picture>
                                <source media="(min-width: 768px)" :srcset="item.image" />
                                <img :src="getMediaUrl(item.thumbnails, 400)" class="product-img img-minicart" alt="Product Image" :title="item.name_orig" />
                            </picture>
                        </div>

                        <div class="col-8">
                            <div class="container">
                                <div class="row">
                                    <span class="product-name" v-text="item.name_orig" />
                                </div>

                                <div class="row">
                                    <ul class="selected-variants-wrp">
                                        <li v-for="(variant, key) in item.variants" :key="key" class="selected-variants">
                                            {{ variant.label }}: {{ variant.value_label }}
                                        </li>
                                    </ul>
                                </div>

                                <div class="row">
                                    <span v-if="item.final_price_item.special_price" class="product-price old-price" v-text="formatPrice(item.final_price_item.special_price)" />
                                    <span class="product-price" :class="{'sale-price': item.final_price_item.special_price}" v-text="formatPrice(item.final_price_item.display_price_brutto)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </nuxt-link>

                <div v-if="interactive" class="col-4 actions-wrp text-right">
                    <div aria-hidden="true" class="remove-item" @click="removeItem(item)" v-text="'Remove'" />

                    <qty-selector :type="true" :min-qty="item.qty" :max-qty="item.stock_item.maxPurchase" @changeQty="onChangeQty(item, $event)" />
                </div>
            </template>

            <template v-if="item.type === 'promotion'">
                <div class="col-8">
                    <div class="row">
                        <div class="col-4">
                            <div class="cart-item-img">
                                <svg-icon icon="promotion" size="xxl" />
                            </div>
                        </div>

                        <div class="col-8">
                            <div v-text="item.name_orig" />

                            <div class="product-price promotion" v-text="formatPrice(item.final_price_item.display_price_brutto)" />
                        </div>
                    </div>
                </div>

                <div v-if="interactive" class="col-4 actions-wrp text-right">
                    <div aria-hidden="true" class="remove-item promotion" @click="removeItem(item)" v-text="'Remove'" />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import ApiClient from '@/utils/api-client';

export default {
    name: 'CartItemsList',

    data() {
        return {};
    },

    props: {
        items: {
            type: Array,
            required: true,
        },
        interactive: {
            type: Boolean,
            required: false,
            default: true,
        },
    },

    computed: {
        ...mapState({
            offcanvas: (state) => state.modNavigation.offcanvas,
            contextToken: (state) => state.modSession.contextToken,
        }),
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
            try {
                let response = await new ApiClient(this.$config).apiCall({
                    action: 'delete',
                    endpoint: 'store-api/checkout/cart/line-item',
                    contextToken: this.contextToken,
                    data: {
                        ids: [item.id],
                    },
                });
                
                $nuxt.$emit('product-remove-from-cart', { product: {
                    name: item.name_orig != null ? item.name_orig : 'undefined',
                    id: item.id,
                    sku: item.sku != null ? item.sku : 'undefined',
                    price: item.final_price_item.display_price_brutto,
                    quantity: item.qty,
                } });

                return this.$emit('items-list-changed', response);
            } catch (e) {
                console.log(e);
            }
        },
        formatPrice: function (price) {
            const formatter = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
            });

            return formatter.format(price);
        },
        onChangeQty: async function (item, qty) {
            let response = await new ApiClient(this.$config).apiCall({
                action: 'patch',
                endpoint: 'store-api/checkout/cart/line-item',
                contextToken: this.contextToken,
                data: {
                    items: [
                        {
                            id: item.id,
                            quantity: qty,
                            referencedId: item.referencedId,
                        },
                    ],
                },
            });

            return this.$emit('items-list-changed', response);
        },
        getStockQtyOfVariant: function (item) {
            // If product has no variants return 10
            return 10;
        },
        getMediaUrl: function (medium, width) {
            let url = '';

             if (width != null && medium != null) {
                medium.forEach((thumbnail) => {
                    if (thumbnail.width === width) {
                        url = thumbnail.url;
                    }
                });
            }

            return url;
        },
        getProductUrl: function (url) {
            let path = '';
            if (url != null) {
                path = url;
            }

            return `/${path}`;
        },
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

    img {
        margin: auto;
        display: block;
    }

    .cart-item-img {
        display: block;
        width: $hbl-cart-item-image-size;
        margin: 0 auto;
        text-align: center;

        img {
            margin: auto;
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
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
            font-size: 14px;

            &.promotion {
                margin-bottom: 0;
            }
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
        max-width: $hbl-cart-item-image-size;
        max-height: $hbl-cart-item-image-size;
    }

    .product-name {
        @include font-size($small-text-font-sizes);
        margin-bottom: 10px;
    }

    .selected-variants-wrp {
        padding: 0;
        margin-bottom: 8px;
    }

    .selected-variants {
        list-style: none;
        @include font-size($small-text-font-sizes);
    }

    .product-price {
        @include font-size($text-font-sizes);
        font-weight: $font-weight-bold;

        &.promotion {
            color: $green;
        }
    }


    .old-price {
        font-weight: 400;
        text-decoration: line-through;

        & + .sale-price {
            color: $error-accent;
            margin-left: 15px;
        }
    }
}

/* Tablet */
@media (min-width: 768px) {
    .cart-item {
        padding: 12px 0;
        margin: 0;
    }
}

@media (min-width: 1024px) {
    .cart-item {
        .img-minicart {
            max-width: $hbl-cart-item-image-size-md;
            max-height: $hbl-cart-item-image-size-md;
        }
    }

    .checkout-overview-wrp {
        .minicart-wrapper {
            .cart-items-list-wrp {
                padding-left: 0px;
                padding-right: 0px;

                

                .col-8 {
                    padding-left: 0px;
                    padding-right: 0px;

                    .product-name {
                        margin-bottom: 20px;
                    }
                }
            }
        }
    }
}
</style>
