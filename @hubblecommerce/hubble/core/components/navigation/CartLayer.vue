<template>
    <div class="minicart-wrapper">
        <div class="container expand-content">
            <div class="row overlay-header">
                <button class="button-icon button-close-menu" @click="toggle()">
                    <i class="icon icon-x" aria-hidden="true" />
                    <material-ripple />
                </button>

                <div class="overlay-headline" v-text="$t('Cart')" />
            </div>

            <div class="row">
                <flash-messages v-if="qty > 0" :fade-out="false" :in-off-canvas="true" />
            </div>

            <div class="row">
                <div v-if="qty === 1" class="col-12 qty-summary" v-text="qty + ' ' + $t('shopping_cart_label_item')" />

                <div v-if="qty > 1" class="col-12 qty-summary" v-text="qty + ' ' + $t('shopping_cart_label_items')" />

                <transition name="fade">
                    <div v-if="qty <= 0" class="empty-cart">
                        <i class="icon icon-shopping-bag" />

                        <div class="headline-1" v-text="$t('Your shopping cart is empty')" />

                        <nuxt-link :to="localePath('index')">
                            <button class="button-primary" @click="hideMenu()" v-text="$t('Discover our products')" />
                        </nuxt-link>
                    </div>
                </transition>
            </div>

            <cart-items-list />

            <div v-if="qty > 0" class="row totals bg-light">
                <div class="col-6" v-text="$t('Subtotal')" />

                <div class="col-6">
                    <span class="float-right font-weight-bold" v-text="getSubTotal()" />
                </div>
            </div>

            <button v-if="qty > 0" class="checkout-btn button-primary" @click.prevent="checkoutCart">
                {{ $t('shopping_cart') }}
                <material-ripple />
            </button>

            <button v-if="qty > 0" class="shopping-button button-secondary" @click.prevent="hideMenu">
                {{ $t('Keep shopping') }}
                <material-ripple />
            </button>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    name: 'CartLayer',

    components: {
        CartItemsList: () => import('../checkout/CartItemsList')
    },

    data() {
        return {
            name: 'TheMiniCart',
        };
    },

    computed: {
        ...mapState({
            qty: state => state.modCart.cart.items_qty,
        }),
        ...mapGetters({
            getSubtotals: 'modCart/getSubtotals',
            priceDecFmt: 'modPrices/priceDecFmt',
            priceAddCur: 'modPrices/priceAddCur',
        }),
    },

    methods: {
        ...mapActions({
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
        toggle: function () {
            this.toggleOffcanvasAction({
                component: this.name,
                direction: 'rightLeft',
            });
        },
        hideMenu: function () {
            this.hideOffcanvasAction();
        },
        getSubTotal: function () {
            let subtotals = this.getSubtotals;

            // Format subtotals
            subtotals = this.priceDecFmt(subtotals);
            subtotals = this.priceAddCur(subtotals);

            return subtotals;
        },
        checkoutCart: function () {
            this.hideMenu();
            this.$router.push({
                path: this.localePath('checkout-cart'),
            });
        },
    },
};
</script>
