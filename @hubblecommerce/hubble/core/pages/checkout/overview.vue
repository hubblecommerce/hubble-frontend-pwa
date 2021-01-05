<template>
    <div class="container checkout-overview-wrp">
        <client-only>
            <button @click="toggleCart()" class="button cart-toggle-wrp">
                <span v-text="!showCart ? $t('Show Cart') : $t('Hide Cart')" />
                <i class="icon" :class="!showCart ? 'icon-chevron-down' : 'icon-chevron-up'"/>
            </button>

            <transition name="fade">
                <div v-if="showCart || ($mq === 'lg')" class="cart-wrp">
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
                <customer-addresses />

                <shipping-methods />

                <payment-methods />
            </div>

            <div class="checkout-actions-wrp">
                <button @click="historyBack()" class="button button-secondary">
                    <i class="icon icon-arrow-left" />
                    {{$t('Back')}}
                    <material-ripple />
                </button>

                <button @click="placeOrder()" class="button button-primary checkout-btn" :disabled="processingCheckout || !isEmpty(errors)">
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
import CartItemsListNonInteractive from "../../components/checkout/CartItemsListNonInteractive";
import Coupons from "../../components/checkout/Coupons";
import Totals from "../../components/checkout/Totals";
import cartValidate from '~/anonymous-middleware/cartValidate';
import CustomerAddresses from '../../components/customer/CustomerAddresses';
import {mapActions, mapMutations, mapState} from "vuex";
import { addBackendErrors } from '../../utils/formMixins';
import _ from "lodash";
import apiCustomerAuthenticate from '~/anonymous-middleware/apiCustomerAuthenticate';

export default {
    name: "CheckoutOverview",

    components: {
        Totals,
        Coupons,
        CartItemsListNonInteractive,
        CustomerAddresses,
        PaymentMethods: () => import('../../components/checkout/PaymentMethods'),
        ShippingMethods: () => import('../../components/checkout/ShippingMethods')
    },

    middleware: [apiCustomerAuthenticate, cartValidate, 'apiLocalization', 'trackClickPath'],

    layout: 'hubble_light',

    mixins: [addBackendErrors],

    data() {
        return {
            showCart: false,
            errors: []
        }
    },

    computed: {
        ...mapState({
            cart: state => state.modCart.cart,
            qty: state => state.modCart.cart.items_qty,
            processingCheckout: state => state.modApiPayment.processingCheckout,
            customer: state => state.modApiCustomer.customer
        }),
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
            return this.qty > 1 ? qty + ' ' + this.$t('shopping_cart_label_items') : qty + ' ' + this.$t('shopping_cart_label_item');
        },
        isApiType: function (apiType) {
            return process.env.API_TYPE === apiType;
        },
        toggleCart: function() {
            return this.showCart = !this.showCart;
        },
        historyBack: function () {
            this.$router.go(-1);
        },
        placeOrder: async function () {
            // Start loading animation
            this.setProcessingCheckout();

            try {
                await this.validateOrder();
            } catch (error) {
                this.resetProcessingCheckout();
                return false;
            }

            let order;
            let paymentResponse;

            try {
                if (this.customer.customerData.guest) {
                    order = await this.placeGuestOrder();
                } else {
                    order = await this.placeOrderAction();
                }

                paymentResponse = await this.swStartPayment(order.data.id);

                if (paymentResponse.data.paymentUrl) {
                    this.resetProcessingCheckout();

                    window.open(paymentResponse.data.paymentUrl, '_self');
                }

                if (_.isEmpty(paymentResponse.data)) {
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
                console.log('placeOrder failed: ', err);

                this.errors.push(this.$t('Order could not be placed successfully'));

                _.forEach(this.addBackendErrors(err), error => {
                    this.errors.push(error);
                });
            }
        },
    }
}
</script>
