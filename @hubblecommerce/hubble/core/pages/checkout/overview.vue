<template>
    <div class="container checkout-overview-wrp">
        <client-only>
            <button class="button cart-toggle-wrp" @click="toggleCart()">
                <span v-text="!showCart ? $t('Show Cart') : $t('Hide Cart')" />
                <i class="icon" :class="!showCart ? 'icon-chevron-down' : 'icon-chevron-up'" />
            </button>

            <transition name="fade">
                <div v-if="showCart || $mq === 'lg'" class="cart-wrp">
                    <div class="items-wrp">
                        <client-only>
                            <div class="headline">
                                <div class="headline-2" v-text="$t('Your Cart')" />
                                <span class="text" v-text="`(${cartItemsLabel(qty)})`" />
                            </div>
                            <cart-items-list-non-interactive :cart="cart" />
                        </client-only>
                    </div>

                    <div class="summary-wrp">
                        <div v-if="!isApiType('sw')" class="voucher">
                            <div class="voucher-content">
                                <coupons />
                            </div>
                        </div>
                        <totals />
                    </div>
                </div>
            </transition>
        </client-only>

        <div class="register-options-wrp">
            <div class="checkout-configs-wrp">
                <new-customer-addresses />

                <shipping-methods />

                <payment-methods v-if="!isShopware" />
                <payment-methods-sw v-if="isShopware" />
            </div>

            <div class="checkout-actions-wrp">
                <button class="button button-secondary" @click="historyBack()">
                    <i class="icon icon-arrow-left" />
                    {{ $t('Back') }}
                    <material-ripple />
                </button>

                <button class="button button-primary checkout-btn" :disabled="processingCheckout" @click="placeOrder()">
                    <span v-if="!processingCheckout">{{ $t('Place Order') }}</span>
                    <div v-if="processingCheckout" class="loader lds-ellipsis">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                    <material-ripple />
                </button>
            </div>

            <template v-for="error in errors">
                <div class="error-message" v-text="error" />
            </template>
        </div>
    </div>
</template>

<script>
import CartItemsListNonInteractive from '../../components/checkout/CartItemsListNonInteractive';
import Coupons from '../../components/checkout/Coupons';
import Totals from '../../components/checkout/Totals';
import cartValidate from '~/anonymous-middleware/cartValidate';
import setCheckoutSession from '~/anonymous-middleware/setCheckoutSession';
import { mapActions, mapMutations, mapState } from 'vuex';
import { addBackendErrors } from '../../utils/formMixins';
import _ from 'lodash';
import NewCustomerAddresses from '../../components/customer/NewCustomerAddresses';

export default {
    name: 'CheckoutOverview',

    components: {
        NewCustomerAddresses,
        Totals,
        Coupons,
        CartItemsListNonInteractive,
        PaymentMethodsSw: () => import('../../components/checkout/PaymentMethodsSw'),
        PaymentMethods: () => import('../../components/checkout/PaymentMethods'),
        ShippingMethods: () => import('../../components/checkout/ShippingMethods'),
    },

    mixins: [addBackendErrors],

    layout: 'hubble_light',

    middleware: [cartValidate, 'apiLocalization', setCheckoutSession, 'trackClickPath'],

    data() {
        return {
            showCart: false,
            errors: [],
            isShopware: process.env.API_TYPE === 'sw',
        };
    },

    computed: {
        ...mapState({
            cart: (state) => state.modCart.cart,
            qty: (state) => state.modCart.cart.items_qty,
            processingCheckout: (state) => state.modApiPayment.processingCheckout,
            customer: (state) => state.modApiCustomer.customer,
        }),
    },

    mounted() {
        console.log();
    },

    methods: {
        ...mapMutations({
            setProcessingCheckout: 'modApiPayment/setProcessingCheckout',
            resetProcessingCheckout: 'modApiPayment/resetProcessingCheckout',
        }),
        ...mapActions({
            validateOrder: 'modApiPayment/validateOrder',
            placeOrderAction: 'modApiPayment/placeOrder',
            placeGuestOrder: 'modApiPayment/placeGuestOrder',
            swStartPayment: 'modApiPayment/swStartPayment',
        }),
        isEmpty: function (val) {
            return _.isEmpty(val);
        },
        cartItemsLabel(qty) {
            return this.qty > 1
                ? qty + ' ' + this.$t('shopping_cart_label_items')
                : qty + ' ' + this.$t('shopping_cart_label_item');
        },
        isApiType: function (apiType) {
            return process.env.API_TYPE === apiType;
        },
        toggleCart: function () {
            return (this.showCart = !this.showCart);
        },
        historyBack: function () {
            this.$router.go(-1);
        },
        placeOrder: async function () {
            // Start loading animation
            this.setProcessingCheckout();

            try {
                this.errors = [];

                // Payment and Shipping isset
                await this.validateOrder();
            } catch (error) {
                this.errors.push(error);
                this.resetProcessingCheckout();
                return false;
            }

            let order;
            let paymentResponse;

            try {
                // Place order
                order = await this.placeOrderAction();

                // Clear cart
                await this.$store.dispatch('modCart/refreshCart', {}, { root: true });

                // Clear order info
                await this.$store.dispatch('modApiPayment/clearOrder');

                // Set order data for success page
                this.$store.commit('modApiPayment/setCurrentOrder', order);
            } catch (err) {
                this.resetProcessingCheckout();

                this.errors.push(this.$t('Order could not be completed.'));
                _.forEach(this.addBackendErrors(err), (error) => {
                    this.errors.push(error);
                });

                return false;
            }

            try {
                // Get params of current route, for extra payment info. E.g. used by paypal express etc.
                let dataBag = this.$router.currentRoute.query;

                // Init payment
                paymentResponse = await this.swStartPayment({ orderId: order.data.id, dataBag: dataBag });

                if (paymentResponse.data.redirectUrl !== null) {
                    this.resetProcessingCheckout();
                    window.open(paymentResponse.data.redirectUrl, '_self');
                } else {
                    this.$router.push(
                        {
                            path: this.localePath('checkout-shopware-success'),
                        },
                        () => {
                            this.resetProcessingCheckout();
                        }
                    );
                }
            } catch (err) {
                console.log(err);
                // Redirect to error page
                this.$router.push(
                    this.localePath({
                        name: 'checkout-error',
                        query: {
                            orderId: order.data.id,
                        },
                    }),
                    () => {
                        this.resetProcessingCheckout();
                    }
                );
            }
        },
    },
};
</script>
