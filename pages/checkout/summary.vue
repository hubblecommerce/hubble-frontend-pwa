<template>
    <div class="container checkout-summary">
        <div class="checkout-summary-wrp">
            <div class="headline headline-1" v-text="$t('Confirm and order')" />

            <div class="terms-and-conditions text">
                {{ $t('By submitting your order, you confirm that you have read and accepted our') }}
                <nuxt-link :to="$t('link-terms-and-conditions')">
                    {{ $t('terms and conditions.') }}
                </nuxt-link>
            </div>

            <div class="edit-data-info text">
                {{ $t('Before submitting your order, you will once again see the data and products you have entered, with the help of the Change links ' +
                'next to the individual data you have the opportunity to correct them again. You can end the order process at any time by closing your ' +
                'browser or by clicking on the button "Order by Paypal".') }}
            </div>

            <customer-addresses />

            <div class="chosen-methods-wrp">
                <div class="chosen-payment-method-wrp">
                    <div class="headline headline-3" v-text="$t('Payment')" />
                    <div class="method" v-text="chosenPaymentMethod.label" />
                    <nuxt-link class="edit-method" :to="localePath('checkout-payment')">
                        {{ $t('Edit payment method') }}
                    </nuxt-link>
                </div>
                <div class="chosen-shipping-method-wrp">
                    <div class="headline headline-3" v-text="$t('Shipping methods') " />
                    <div class="method" v-text="chosenShippingMethod.label" />
                    <nuxt-link class="edit-method" :to="localePath('checkout-payment')">
                        {{ $t('Edit shipping method') }}
                    </nuxt-link>
                </div>
            </div>

            <client-only>
                <cart-items-list-non-interactive v-if="cart" :cart="cart" />
            </client-only>

            <div v-if="checkForSaleItemInCart()" class="order-info-wrp">
                <p class="text-small">
                    An dieser Stelle möchten wir unsere Online-Shop Kunden darauf hinweisen, dass trotz größter Sorgfalt, die Artikel im
                    SALE-Bereich kleine Mängel aufweisen können. In wenigen Fällen können leichte Farbunterschiede bei den einzelnen Schuhen vorkommen,
                    welche vor allem bei naturbelassenen Ledern auftreten können. Minimale Produktionsfehler sind bei Produkten aus dem SALE-Bereich
                    nicht immer auszuschließen. Da bei den Verpackungen der SALE-Artikel keine 100%ige Unversehrtheit garantiert werden kann, werden diese
                    Produkte teilweise in leicht beschädigter oder neutraler Verpackung geliefert. Selbstverständlich haben Sie auch auf SALE-Artikel
                    ein 14-tägiges Rückgaberecht. Wir bedanken uns für Ihr Verständnis und wünschen Ihnen weiterhin viel Vergnügen in unserem Online-Shop!
                </p>
                <div class="hbl-checkbox">
                    <input id="order-info-check" v-model="acceptedInfo" type="checkbox">
                    <label for="order-info-check" class="method-label">
                        {{ $t('I have read the notice and accept it.') }}
                    </label>
                </div>
                <div v-if="acceptedInfoError" class="validation-msg" v-text="$t('Please confirm that you have read this information.')" />
            </div>

            <div class="summary-container">
                <div class="summary-wrp">
                    <totals />
                    <div v-for="(msg, key) in checkoutError" :key="key" class="errors">
                        {{ msg }}
                    </div>
                    <payone-channel />
                    <button class="button-primary checkout-btn" :disabled="processingCheckout || !isEmpty(checkoutError)" @click="placeOrder()">
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
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
    import axios from 'axios';
    import CartItemsListNonInteractive from "../../components/checkout/CartItemsListNonInteractive";
    import Totals from "../../components/checkout/Totals";
    import base64 from "base-64";
    import CustomerAddresses from "../../components/customer/CustomerAddresses";
    import _ from 'lodash';

    export default {
        name: "Summary",

        components: {
            CustomerAddresses,
            Totals,
            CartItemsListNonInteractive
        },

        middleware: [
            'apiPaymentAuthenticate',
            'apiCustomerAuthenticate',
            'cartValidate',
            'orderValidate',
            'apiLocalization',
            'trackClickPath'
        ],

        layout: 'hubble_light',

        data() {
            return {
                acceptedInfo: false,
                acceptedInfoError: false,
                hasSaleItemInCart: false,
                checkoutError: []
            }
        },

        computed: {
            ...mapState({
                paymentMethods: state => state.modApiPayment.paymentMethods,
                chosenPaymentMethod: state => state.modApiPayment.order.chosenPaymentMethod,
                chosenShippingMethod: state => state.modApiPayment.order.chosenShippingMethod,
                cart: state => state.modCart.cart,
                shippingCosts: state => state.modCart.shippingCosts,
                customer: state => state.modApiCustomer.customer,
                order: state => state.modApiPayment.order,
                finalOrder: state => state.modApiPayment.finalOrder,
                processingCheckout: state => state.modApiPayment.processingCheckout,
                customerAddresses: state => state.modApiCustomer.customer.customerAddresses,
                countries: state => state.modApiCustomer.availableCountries,
                shippingAddress: state => state.modApiCustomer.customer.shippingAddress
            }),
            ...mapGetters({
                productIsSpecial: 'modPrices/productIsSpecial'
            })
        },

        watch: {
            customerAddresses: function() {
                // If addresses change do check if chosen payment method is available for new address
                this.getPaymentMethods().then(() => {
                    if(!this.isAllowedMethod(this.chosenPaymentMethod.key)) {
                        this.setChosenPaymentMethod({});
                    }
                });

                this.calculateShippingCost();

            }
        },

        methods: {
            ...mapMutations({
                setChosenPaymentMethod: 'modApiPayment/setChosenPaymentMethod',
                setBeforePlaceOrder: 'modApiPayment/setBeforePlaceOrder',
                setProcessingCheckout: 'modApiPayment/setProcessingCheckout'
            }),
            ...mapActions({
                asyncSetFinalOrder: 'modApiPayment/asyncSetFinalOrder',
                flashMessage: 'modFlash/flashMessage',
                placeOrderAction: 'modApiPayment/placeOrder',
                clearCart: 'modCart/clearAll',
                clearOrder:'modApiPayment/clearOrder',
                getPaymentMethodsAction: 'modApiPayment/getPaymentMethods',
                recalculateShippingCost: 'modCart/recalculateShippingCost'
            }),
            // Event based place order function
            // validates complete order object
            // emits event setBeforePlaceOrder after validation
            // use watch on state.modApiPayment.beforePlaceOrder to listen on event and hook
            // eg. your payment provider
            placeOrder: function() {
                // Handle error if customer has not accept terms and conditions
                this.acceptedInfoError = false;
                if(!this.acceptedInfo && this.hasSaleItemInCart) {
                    this.acceptedInfoError = true;
                    return;
                }

                let order = this.createOrderObject();

                // Save complete order object in state
                this.asyncSetFinalOrder(order).then(() => {
                    // Start loading animation
                    this.setProcessingCheckout();
                    // Emit setBeforePlaceOrder event
                    this.setBeforePlaceOrder();
                });
            },

            createOrderObject: function() {
                // Validate order object (shipping / payment)
                if(_.isEmpty(this.order.chosenPaymentMethod)) {
                    console.log("Payment method is invalid");
                    return;
                }

                if(_.isEmpty(this.order.chosenShippingMethod)) {
                    console.log("Shipping method is invalid");
                    return;
                }

                // Clone order object to not mess up the order object in store
                let order = _.clone(this.order);

                // Validate cart
                if(this.cart.items_qty < 1) {
                    console.log("Cart is empty");
                    return;
                }

                // Set cart to order
                order.cart = this.cart;

                // Set shipping costs to order
                _.assign(order, {shippingCosts: this.shippingCosts});

                // Validate customer
                _.assign(order, {customer: null});
                if(this.customer.customerData.id === null) {
                    console.log("Customer invalid");
                    return;
                }

                // Add customer to order
                let customerId = this.customer.customerData.id;
                let customerType = customerId === undefined ? 'GUEST' : 'REG' ;
                order.customer = {
                    customerId: customerId,
                    customerType: customerType,
                    email: this.customer.customerData.email,
                    firstName: this.customer.customerData.firstname,
                    lastName: this.customer.customerData.lastname,
                    birthday: this.customer.customerData.birthday,
                    phone: this.customer.customerData.phone,
                };

                // Validate addresses
                if(_.isEmpty(this.customer.billingAddress) || _.isEmpty(this.customer.shippingAddress)) {
                    this.flashMessage({
                        flashType: 'error',
                        flashMessage: 'Addresses empty'
                    });
                    console.log("Addresses empty");
                    return;
                }

                // Get addresses from store
                _.assign(order, {addresses: []});

                // Set shipping/billing flag for billingAddress/shippingAddress false
                // to ensure if there is only one address for both with all flags = true
                let billingAddress = _.clone(this.customer.billingAddress);
                billingAddress.is_shipping = false;

                let shippingAddress = _.clone(this.customer.shippingAddress);
                shippingAddress.is_billing = false;

                // Push addresses to order
                order.addresses.push(billingAddress);
                order.addresses.push(shippingAddress);

                // Set StoreId from .env to identify order
                if(_.isEmpty(process.env.STORE_ID)) {
                    console.log("Please set store id in env");
                    return;
                }

                // Add store ID from .env file to order to identify
                order.storeId = process.env.STORE_ID;

                return order;
            },

            // Action to place order directly without event based payment provider hook
            dispatchPlaceOrder: function() {
                // Order object holds every important data and is ready to be sent to api
                this.placeOrderAction({
                    payload: JSON.stringify(this.finalOrder)
                }).then((response) => {
                    // On request failure, throw error, log error and keep order data
                    if(!response.data.success) {
                        axios({
                            method: 'POST',
                            url: '/api/hubble-logger',
                            data: {
                                level: "error",
                                msg: "Hubble Checkout dispatchPlaceOrder modApiPayment/placeOrder: %o",
                                payload: response.data
                            }
                        });
                        console.log(response.data.message);
                        return;
                    }

                    // On request success clear data (order, cart)
                    // and redirect to success page
                    this.clearCart().then(() => {
                        this.clearOrder().then(() => {
                            this.$router.push({
                                path: this.localePath('checkout-success')
                            });
                        });
                    });
                }).catch((error) => {
                    axios({
                        method: 'POST',
                        url: '/api/hubble-logger',
                        data: {
                            level: "error",
                            msg: "Hubble Checkout dispatchPlaceOrder modApiPayment/placeOrder: %o",
                            payload: error
                        }
                    });
                });
            },

            getPaymentMethods: function() {
                return new Promise((resolve, reject) => {
                    // Get payment methods from api
                    this.getPaymentMethodsAction().then(() => {
                        resolve();
                    }).catch((error) => {
                        console.log(error);
                        reject(error);
                    });
                })
            },

            isAllowedMethod: function(key) {

                // Get method by key
                let method = _.find(this.paymentMethods, function(o) {
                    return o.key === key;
                });

                // Check if method is available
                if( _.isEmpty(method)) {
                    return true;
                }

                // Check if payment method is allowed for current address
                if(method.fraud || method.blacklist) {
                    return false;
                }

                return true;
            },

            calculateShippingCost: function() {
                let object = {
                    order: JSON.stringify(this.createOrderObject())
                };

                this.recalculateShippingCost(object)
                .then((response) => {
                    // Check if send country code matches received country code, otherwise country is not allowed
                    if(response.data.order.shippingAllowed) {
                        this.checkoutError = [];
                    } else {
                        this.checkoutError.push(this.$t('Shipping to this country is not allowed'));
                    }
                })
                .catch((error) => {
                    this.flashMessage({
                        flashType: 'error',
                        flashMessage: 'Shipping costs could not be calculated.'
                    });
                });
            },

            checkForSaleItemInCart: function() {
                let hasSpecialItem = false;

                _.forEach(this.cart.items, (item) => {
                    hasSpecialItem = this.productIsSpecial(item);
                });

                this.hasSaleItemInCart = hasSpecialItem;
                return hasSpecialItem;
            },

            isEmpty: function(val) {
                return _.isEmpty(val);
            }
        },

        head() {
            return {
                meta: [
                    { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }
                ]
            }
        }
    }
</script>
