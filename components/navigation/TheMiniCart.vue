<template>
    <div :class="hasItemsInCart" class="minicart-cpt-wrp">
        <button class="button-icon cart-icon"
                :class="setButtonStates"
                @click="toggle()"
        >
            <i class="icon icon-cart" aria-hidden="true" />
            <span class="hidden-link-name">Toggle Cart</span>
            <material-ripple />
            <client-only>
                <div v-if="cartItemsQtyAndLabel" class="item-count" v-text="cartItemsQtyAndLabel" />
            </client-only>
        </button>
        <transition-expand-layer :right-left="true">
            <div v-if="showMenu" class="transition-expand-wrp minicart-wrapper">
                <div class="container expand-content">

                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu"
                                @click="toggle()"
                        >
                            <i class="icon icon-close" aria-hidden="true" />
                            <material-ripple />
                        </button>
                        <div class="overlay-headline" v-text="$t('Cart')" />
                    </div>

                    <div class="row">
                        <flash-message v-if="qty > 0" :fade-out="false" :in-off-canvas="true" />
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
                                            @click="closeOffcanvas()"
                                            v-text="$t('Discover our products')"
                                    />
                                </nuxt-link>
                            </div>
                        </transition>
                    </div>

                    <cart-items-list />

                    <div v-if="cartItemsQty > 0" class="row totals bg-light">
                        <div class="col-6">
                            {{ $t('Subtotal') }}
                        </div>
                        <div class="col-6">
                            <span class="float-right font-weight-bold" v-html="getSubTotal()" />
                        </div>
                    </div>

                    <button v-if="cartItemsQty > 0"
                            class="checkout-btn button-primary"
                            @click.prevent="checkoutCart">
                        {{ $t('shopping_cart') }}
                        <material-ripple />
                    </button>
                    <button v-if="cartItemsQty > 0"
                            class="shopping-button button-secondary"
                            @click.prevent="hideMenu"
                    >
                        {{ $t('Keep shopping') }}
                        <material-ripple />
                    </button>

                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex';
    import CartItemsList from "../checkout/CartItemsList";

    export default {
        name: "TheMiniCart",
        components: {CartItemsList},
        data() {
            return {
                name: "TheMiniCart",
                showMiniCart: false,
                item: {
                    items_qty: 0,
                    subtotal: 0
                }
            }
        },

        computed: {
            ...mapState({
                items: state => state.modCart.cart.items,
                qty: state => state.modCart.cart.items_qty,
                offcanvas: state => state.modNavigation.offcanvas,
            }),
            ...mapGetters({
                getSubtotals: 'modCart/getSubtotals',
                priceDecFmt: 'modPrices/priceDecFmt',
                priceAddCur: 'modPrices/priceAddCur'
            }),
            hasItemsInCart: function() {
                return {
                    inCart: this.cartItemsQty > 0
                }
            },
            setButtonStates: function() {
                return {
                    active: this.showMenu
                }
            },
            cartItemsQty() {
                return this.qty;
            },
            cartItemsLabel() {
                return this.item.items_qty > 0 ? this.$t('shopping_cart_label_items') : this.$t('shopping_cart_label_item');
            },
            cartItemsQtyAndLabel() {
                if(this.cartItemsQty > 99) return '99+';

                return this.cartItemsQty;
            },
            showMenu: function() {
                return this.offcanvas.component === this.name;
            }
        },

        watch: {
            '$route.path': function() {
                // Close menu layer if route changes
                this.hideMenu();
            }
        },

        created() {
            // init local reactive 'item'
            if (this.dataCartItem) {
                this.item = this.dataCartItem;
            }
        },

        methods: {
            ...mapActions({
                toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
                hideOffcanvasAction: 'modNavigation/hideOffcanvasAction'
            }),
            toggle: function() {
                this.toggleOffcanvasAction({
                    component: this.name,
                    direction: 'rightLeft'
                });
            },
            hideMenu() {
                this.hideOffcanvasAction();
            },
            getSubTotal: function() {
                let subtotals = this.getSubtotals;

                // Format subtotals
                subtotals = this.priceDecFmt(subtotals);
                subtotals = this.priceAddCur(subtotals);

                return subtotals;
            },
            checkoutCart() {
                this.hideMenu();
                this.$router.push({
                    path: this.localePath('checkout-cart')
                });
            },
            closeOffcanvas: function() {
                this.hideOffcanvasAction();
            }
        }
    }
</script>
