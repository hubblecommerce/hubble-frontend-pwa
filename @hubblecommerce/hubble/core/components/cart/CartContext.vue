<template>
    <div class="minicart-wrapper">
        <div :class="{ 'expand-content': displayInLayer }" class="container">
            <div v-if="displayInLayer" class="row overlay-header">
                <hbl-button class="button-icon" @click.native="hideOffcanvasAction">
                    <div class="hidden-link-name" v-text="'Close'" />
                    <svg-icon icon="x" />
                </hbl-button>
                <div class="overlay-headline">
                    <span v-text="'Cart'" />
                    <span v-if="qty === 1" class="cart-counter" v-text="`(${qty} Item)`" />
                    <span v-if="qty > 1" class="cart-counter" v-text="`(${qty} Items)`" />
                </div>
            </div>

            <template v-if="qty > 0 && !isLoading">
                <flash-message class="flash-message-wrapper"/>

                <div class="cart-counter-wrp">
                    <div v-if="qty === 1" class="col-12 qty-summary" v-text="`${qty} Item`" />
                    <div v-if="qty > 1" class="col-12 qty-summary" v-text="`${qty} Items`" />
                </div>
                <div class="row overlay-content">
                    <lazy-cart-items-list :interactive="interactive" :items="products" v-on:items-list-changed="setCartData($event)" />

                    <promotion-input v-on:promotion-code-added="setCartData($event)" />

                    <cart-totals :totals="totals" />

                    <template v-if="interactive">
                        <div class="container">
                            <div class="action-row">
                                <div class="button-wrp">
                                    <hbl-button class="shopping-button button-secondary" @click.native="hideMenu">
                                        {{ 'Keep shopping' }}
                                    </hbl-button>
                                </div>
                                <div class="button-wrp">
                                    <hbl-button class="checkout-btn button-primary" @click.native="checkoutCart">
                                        {{ 'Checkout' }}
                                    </hbl-button>
                                </div>
                            </div>

                            <plugin-slot name="cart-context-actions-after" :data="{}" />
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
                            <hbl-button class="button-secondary" @click.native="hideMenu" v-text="'Discover our products'" />
                        </nuxt-link>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import ApiClient from '@/utils/api-client';
import { mappingCartProduct, mappingCartPromotion } from '@/utils/api-mapping-helper';

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
        } else {
            this.resetCart();
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
            resetCart: 'modCart/resetCart',
        }),
        fetchCart: async function () {
            try {
                this.isLoading = true;
                const response = await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: 'store-api/checkout/cart',
                    headers: [{ 'sw-include-seo-urls': true }],
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
            this.products = this.mappingLineItems(cartResponse.data.lineItems);
            this.totals = this.mappingTotals(cartResponse.data);

            this.saveCart(cartResponse);
        },
        mappingLineItems: function (lineItems) {
            let mappedLineItems = [];
            this.qty = 0;

            lineItems.forEach((lineItem) => {
                if (lineItem.type === 'product') {
                    mappedLineItems.push(mappingCartProduct(lineItem));
                    this.qty = this.qty + lineItem.quantity;
                } else if (lineItem.type === 'promotion') {
                    mappedLineItems.push(mappingCartPromotion(lineItem));
                }
            });

            return mappedLineItems;
        },
        mappingTotals: function (data) {
            return {
                subTotals: data.price.positionPrice,
                totals: data.price.totalPrice,
                shippingCosts: data.deliveries.length > 0 ? data.deliveries[0].shippingCosts.totalPrice : 0,
                tax: data.price.calculatedTaxes
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
        hideMenu: function () {
            this.hideOffcanvasAction();
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.flash-message-wrapper {
    margin-top: 20px;
}

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
        padding: 12px 15px 12px 0px;
    }

    .separator {
        margin: 0 3px;
    }

    .no-items {
        margin: 0 !important;
    }

    .checkout-btn,
    .shopping-button {
        width: 100%;
    }

    .shopping-button {
        display: none;
    }

    .checkout-btn {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 20;
    }
}

.cart-counter-wrp {
    margin-bottom: 10px;
}

.overlay-content {
    padding-bottom: 40px;
}

.loader-wrp {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70vh;
}

.overlay-headline {
    .cart-counter {
        display: none;
    }
}

/* Tablet */
@media (min-width: 768px) {
    .minicart-wrapper {
        .expand-content {
            .overlay-headline {
                .cart-counter {
                    display: inline;
                }
            }

            .overlay-content {
                padding: 30px 0 50px;
                max-height: calc(100vh - 50px);
                overflow-y: auto;
            }
        }

        .shopping-button {
            display: block;
        }

        .checkout-btn {
            position: relative;
        }
    }

    .cart-counter-wrp {
        display: none;
    }

    .action-row {
        display: flex;
        margin: 0 -5px;
        padding-left: 25px;
        padding-right: 25px;

        .button-wrp {
            width: 50%;
            margin: 0 5px;
        }
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .minicart-wrapper {
        .expand-content {
            .overlay-content {
                max-height: calc(100vh - 122px);
            }
        }
    }
}
</style>
