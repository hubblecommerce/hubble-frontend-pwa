<template>
    <div class="minicart-wrapper">
        <div :class="{ 'expand-content': displayInLayer }" class="container">
            <div v-if="displayInLayer" class="row overlay-header">
                <hbl-button class="button-icon" @click.native="hideOffcanvasAction">
                    <div class="hidden-link-name" v-text="'Close'" />
                    <svg-icon icon="x" />
                </hbl-button>
                <div class="overlay-headline" v-text="'Cart'" />
            </div>

            <flash-message />

            <template v-if="qty > 0 && !isLoading">
                <div class="row">
                    <div v-if="qty === 1" class="col-12 qty-summary" v-text="`${qty} Item`" />
                    <div v-if="qty > 1" class="col-12 qty-summary" v-text="`${qty} Items`" />

                    <lazy-cart-items-list
                        :interactive="interactive"
                        :items="products"
                        v-on:items-list-changed="setCartData($event)"
                    />

                    <div class="totals container">
                        <div class="row">
                            <div class="col-6" v-text="'Subtotal'" />
                            <div class="col-6 value" v-text="formatPrice(totals.subTotals)" />
                        </div>

                        <div class="row">
                            <div class="col-6" v-text="'Shipping'" />
                            <div class="col-6 value" v-text="formatPrice(totals.shippingCosts)" />
                        </div>

                        <div class="row">
                            <div class="col-6" v-text="'Totals'" />
                            <div class="col-6 value" v-text="formatPrice(totals.totals)" />
                        </div>
                    </div>

                    <template v-if="interactive">
                        <div class="container">
                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <hbl-button class="shopping-button button-secondary" @click.native="hideMenu">
                                        {{ 'Keep shopping' }}
                                    </hbl-button>
                                </div>
                                <div class="col-12 col-md-6">
                                    <hbl-button class="checkout-btn button-primary" @click.native="checkoutCart">
                                        {{ 'Checkout' }}
                                    </hbl-button>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </template>

            <loader v-else-if="isLoading" />

            <template v-else>
                <div class="row">
                    <div class="empty-cart">
                        <svg-icon icon="shopping-bag" />
                        <div class="text" v-text="'Your shopping cart is empty'" />
                        <nuxt-link :to="'/'">
                            <hbl-button
                                class="button-secondary"
                                @click.native="hideMenu"
                                v-text="'Discover our products'"
                            />
                        </nuxt-link>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import apiClient from '@/utils/api-client';
import { mappingCartProduct } from '@/utils/api-mapping-helper';

export default {
    name: 'CartContext',

    props: {
        displayInLayer: {
            type: Boolean,
            required: false,
            default: false,
        },
        interactive: {
            type: Boolean,
            required: false,
            default: true,
        },
        recalculateCart: {
            type: Number,
            required: false,
            default: null,
        },
    },

    data() {
        return {
            isLoading: false,
            products: null,
            totals: null,
            qty: 0,
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
    },

    async mounted() {
        if (this.contextToken !== null) {
            let response = await this.fetchCart();
            this.setCartData(response);
        }
    },

    watch: {
        recalculateCart: async function () {
            let response = await this.fetchCart();
            this.setCartData(response);
        },
    },

    methods: {
        ...mapActions({
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
        ...mapMutations({
            saveCart: 'modCart/setCart',
        }),
        fetchCart: async function () {
            try {
                this.isLoading = true;
                const response = await new apiClient().apiCall({
                    action: 'post',
                    endpoint: 'store-api/v3/checkout/cart',
                    contextToken: this.contextToken,
                });
                this.isLoading = false;
                return response;
            } catch (requestError) {
                this.isLoading = false;
                return { requestError };
            }
        },
        setCartData: function (cartResponse) {
            this.products = this.mappingProducts(cartResponse.data.lineItems);
            this.totals = this.mappingTotals(cartResponse.data);

            this.saveCart(cartResponse);
        },
        mappingProducts: function (products) {
            let mappedProducts = [];
            this.qty = 0;

            products.forEach((product) => {
                mappedProducts.push(mappingCartProduct(product));
                this.qty = this.qty + product.quantity;
            });

            return mappedProducts;
        },
        mappingTotals: function (data) {
            return {
                subTotals: data.price.positionPrice,
                totals: data.price.totalPrice,
                shippingCosts: data.deliveries.length > 0 ? data.deliveries[0].shippingCosts.totalPrice : 0,
            };
        },
        checkoutCart: function () {
            this.$router.push(
                {
                    path: '/checkout',
                },
                () => {
                    this.hideMenu();
                }
            );
        },
        formatPrice: function (price) {
            const formatter = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
            });

            return formatter.format(price);
        },
        hideMenu: function () {
            this.hideOffcanvasAction();
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    width: 100%;

    &.cart-wrp {
        padding: 60px;
        margin: 20px 0;
        border: 1px solid $border-color;
    }

    i {
        width: 130px;
        height: 130px;
        line-height: 130px;
        text-align: center;
        color: $border-color;
        font-size: 45px;
        margin-bottom: 20px;
        border: 3px dotted $border-color;
        border-radius: 150px;
    }

    .text {
        font-size: 16px;
        margin-bottom: 40px;
        text-align: center;
    }
}

.minicart-wrapper {
    a {
        color: $text-primary !important;
    }

    .product-qty {
        margin-bottom: 20px;
    }

    .qty-summary {
        font-size: 14px;
        line-height: 17px;
        font-weight: 600;
        padding: 12px 15px;
        border-bottom: 1px solid $border-color;
    }

    .separator {
        margin: 0 3px;
    }

    .no-items {
        margin: 0 !important;
    }

    .totals {
        background: $light-gray;
        padding: 30px 50px;
        margin-bottom: 20px;

        .row {
            margin-bottom: 10px;

            &:last-child {
                padding-top: 10px;
                margin-bottom: 0;
                font-weight: $font-weight-bold;
            }
        }

        .value {
            text-align: right;
        }
    }

    .checkout-btn,
    .shopping-button {
        width: 100%;
        margin-bottom: 20px;
    }
}

.loader-wrp {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70vh;
}

/* Tablet */
@media (min-width: 768px) {
}

/* Desktop */
@media (min-width: 1024px) {
}
</style>
