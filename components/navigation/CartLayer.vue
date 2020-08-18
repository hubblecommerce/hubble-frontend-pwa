<template>
    <div class="minicart-wrapper">
        <div class="container expand-content">
            <div class="row overlay-header">
                <div class="overlay-headline" v-text="$t('Cart')" />
            </div>

            <div class="row">
                <flash-messages v-if="qty > 0" :fade-out="false" :in-off-canvas="true" />
            </div>

            <div class="row">
                <div v-if="qty === 1" class="col-12 qty-summary">
                    {{ qty }} {{ $t('shopping_cart_label_item') }}
                </div>

                <div v-if="qty > 1" class="col-12 qty-summary">
                    {{ qty }} {{ $t('shopping_cart_label_items') }}
                </div>

                <transition name="fade">
                    <div v-if="qty <= 0" class="empty-cart">
                        <i class="icon icon-cart" />

                        <div class="headline-1" v-text="$t('Your shopping cart is empty')" />

                        <nuxt-link :to="localePath('index')">
                            <button class="button-primary"
                                    @click="hideMenu()"
                                    v-text="$t('Discover our products')"
                            />
                        </nuxt-link>
                    </div>
                </transition>
            </div>

            <cart-items-list />

            <div class="actions">
                <div v-if="qty > 0" class="row totals bg-light">
                    <div class="col-6">
                        {{ $t('Subtotal') }}
                    </div>

                    <div class="col-6">
                        <span class="float-right font-weight-bold" v-html="getSubTotal()" />
                    </div>
                </div>


                <button v-if="qty > 0"
                        class="checkout-btn button-primary"
                        @click.prevent="checkoutCart"
                >
                    {{ $t('shopping_cart') }}
                    <material-ripple />
                </button>

                <button v-if="qty > 0"
                        class="shopping-button button-secondary"
                        @click.prevent="hideMenu"
                >
                    {{ $t('Keep shopping') }}
                    <material-ripple />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from "vuex";
    import CartItemsList from "../checkout/CartItemsList";
    export default {
        name: 'CartLayer',

        components: {
            CartItemsList,
        },

        data() {
            return {
                name: "TheMiniCart",
            }
        },

        computed: {
            ...mapState({
                qty: state => state.modCart.cart.items_qty,
            }),
            ...mapGetters({
                getSubtotals: 'modCart/getSubtotals',
                priceDecFmt: 'modPrices/priceDecFmt',
                priceAddCur: 'modPrices/priceAddCur'
            }),
        },

        methods: {
            ...mapActions({
                hideOffcanvasAction: 'modNavigation/hideOffcanvasAction'
            }),
            hideMenu: function() {
                this.hideOffcanvasAction();
            },
            getSubTotal: function() {
                let subtotals = this.getSubtotals;

                // Format subtotals
                subtotals = this.priceDecFmt(subtotals);
                subtotals = this.priceAddCur(subtotals);

                return subtotals;
            },
            checkoutCart: function() {
                this.hideMenu();
                this.$router.push({
                    path: this.localePath('checkout-cart')
                });
            },
        }
    }
</script>
