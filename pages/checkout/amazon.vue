<template>
    <div class="container checkout-summary amazon-pay">
        <div class="checkout-summary-wrp">
            <div class="headline headline-1" v-text="'Amazon Payment'" />

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

            <amazon-pay-widgets />

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
                    <div v-for="(msg, key) in Object.keys(amazonPayError)" :key="key" class="errors">
                        {{ amazonPayError[msg] }}
                    </div>
                    <button class="button-primary checkout-btn" :disabled="processingCheckout || !isEmpty(amazonPayError)" @click="placeOrder()">
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
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
    import axios from 'axios';
    import Totals from "../../components/checkout/Totals";
    import { clearDataLayer } from "@hubblecommerce/hubble/core/utils/gtmHelper";
    import _ from 'lodash';

    export default {
        name: "Amazon",

        components: {Totals},

        middleware: [
            'apiPaymentAuthenticate',
            'cartValidate',
            'apiLocalization',
            'trackClickPath'
        ],

        layout: 'hubble_express',

        data() {
            return {
                acceptedInfo: false,
                acceptedInfoError: false,
                orderClone: null,
                hasError: null,
                hasSaleItemInCart: false
            }
        },

        computed: {
            ...mapState({
                chosenPaymentMethod: state => state.modApiPayment.order.chosenPaymentMethod,
                chosenShippingMethod: state => state.modApiPayment.order.chosenShippingMethod,
                cart: state => state.modCart.cart,
                shippingCosts: state => state.modCart.shippingCosts,
                customer: state => state.modApiCustomer.customer,
                order: state => state.modApiPayment.order,
                finalOrder: state => state.modApiPayment.finalOrder,
                processingCheckout: state => state.modApiPayment.processingCheckout,
                expressOrderReferenceId: state => state.modApiPayment.expressOrderReferenceId,
                amazonPayError: state => state.modApiPayment.amazonPayError,
            }),
            ...mapGetters({
                productIsSpecial: 'modPrices/productIsSpecial'
            }),
            isLoggedIn: function() {
                if(!_.isEmpty(this.customer.customerAuth) && this.customer.customerAuth.token !== 'guest') {
                    return this.customer.customerAuth.token;
                }

                return false;
            }
        },

        created() {
            this.setProcessingCheckout();
        },

        methods: {
            ...mapMutations({
                setProcessingCheckout: 'modApiPayment/setProcessingCheckout',
                resetProcessingCheckout: 'modApiPayment/resetProcessingCheckout',
                setChosenPaymentMethod: 'modApiPayment/setChosenPaymentMethod',
                setChosenShippingMethod:'modApiPayment/setChosenShippingMethod',
                setOrderIdInStore: 'modApiPayment/setOrderId'
            }),
            ...mapActions({
                getUuid: 'modApiPayment/getUuid',
                registerGuest: 'modApiCustomer/registerGuest',
                placeOrderAction: 'modApiPayment/placeOrder',
                clearCart: 'modCart/clearAll',
                clearOrder: 'modApiPayment/clearOrder'
            }),
            isEmpty: function(val) {
                return _.isEmpty(val);
            },
            placeOrder: function() {
                // Start loader
                this.setProcessingCheckout();

                // Check if no amazon pay error e.g. shipping country not in tablerates / not allowed
                if(!this.isEmpty(this.amazonPayError)) {
                    return;
                }

                // Handle error if customer has not accept terms and conditions
                this.acceptedInfoError = false;
                if(!this.acceptedInfo && this.hasSaleItemInCart) {
                    this.resetProcessingCheckout();
                    this.acceptedInfoError = true;
                    return;
                }

                // Validate cart
                if(this.cart.items_qty < 1) {
                    console.log("Cart is empty");
                    this.resetProcessingCheckout();
                    return;
                }

                // Set Payment
                let chosenPaymentMethod = {
                    key: "amazon",
                    label: "Amazon Pay",
                    payload: {
                        paymentResponse: {}
                    }
                };
                this.setChosenPaymentMethod(chosenPaymentMethod);

                // Set shipping
                let chosenShippingMethod = {
                    id: 2,
                    label: "DHL",
                    description: "Shipping by DHL",
                    key: "shipping_by_dhl"
                };
                this.setChosenShippingMethod(chosenShippingMethod);

                // Start API Calls to Amazon
                this.setOrderId().then(() => {

                    // Get totals for coupons
                    let total;
                    if(this.cart.discount > 0) {
                        total = this.cart.grand_total_with_discount;
                    } else {
                        total = this.cart.grand_total;
                    }

                    let args = {
                        orderId: this.order.id,
                        storeName: process.env.STORE_ID,
                        orderReferenceId: this.expressOrderReferenceId,
                        amount: total,
                        currencyCode: process.env.AMAZON_PAY_CURRENCY
                    };

                    // Call SetOrderReferenceDetails
                    this.setOrderReferenceDetails(args).then((data) => {

                        // Check if setOrderReferenceDetails was successful
                        if(_.isEmpty(data.SetOrderReferenceDetailsResponse)) {
                            console.log("setOrderReferenceDetails request failed");
                            this.resetProcessingCheckout();
                            return;
                        }

                        // Call ConfirmOrderReference
                        this.confirmOrderReference(this.expressOrderReferenceId).then((data) => {

                            if(_.isEmpty(data.ConfirmOrderReferenceResponse)) {
                                console.log("confirmOrderReference request failed");
                                this.resetProcessingCheckout();
                                return;
                            }

                            // Call Authorization (synchronous mode) (capture now mode)
                            this.authAndCapture(args).then(() => {

                                // Call GetOrderReferenceDetails
                                this.getOrderReferenceDetails(this.expressOrderReferenceId).then((data) => {

                                    // Build order object for hubble api from amazon data
                                    // Place order to hubble api / shop system
                                    this.validateAndPlaceOrder(data);

                                });
                            });

                        });

                    });
                });
            },
            getOrderReferenceDetails: function(orderReferenceId) {
                return new Promise((resolve, reject) => {
                    axios({
                        method: 'GET',
                        url: '/api/amazon-get-order-reference-details',
                        params: {orderReferenceId: orderReferenceId},
                    }).then((response) => {
                        resolve(response.data);
                    }).catch((response) => {
                        console.log("API request %o to %o failed: %o", 'GET', '/api/amazon-get-order-reference-details', response);
                        this.resetProcessingCheckout();
                        reject(response)
                    });
                });
            },
            authAndCapture: function(args) {
                return new Promise((resolve, reject) => {
                    axios({
                        method: 'GET',
                        url: '/api/amazon-auth-and-capture',
                        params: args,
                    }).then((response) => {
                        resolve(response.data);
                    }).catch((response) => {
                        console.log("API request %o to %o failed: %o", 'GET', '/api/amazon-auth-and-capture', response);
                        this.resetProcessingCheckout();
                        reject(response)
                    });
                })
            },
            confirmOrderReference: function(orderReferenceId) {
                return new Promise((resolve, reject) => {
                    axios({
                        method: 'GET',
                        url: '/api/amazon-confirm-order-reference',
                        params: {orderReferenceId: orderReferenceId},
                    }).then((response) => {
                        resolve(response.data);
                    }).catch((response) => {
                        console.log("API request %o to %o failed: %o", 'GET', '/api/amazon-confirm-order-reference', response);
                        this.resetProcessingCheckout();
                        reject(response)
                    });
                })
            },
            setOrderReferenceDetails: function(args) {
                return new Promise((resolve, reject) => {
                    axios({
                        method: 'GET',
                        url: '/api/amazon-set-order-reference-details',
                        params: args,
                    }).then((response) => {
                        resolve(response.data);
                    }).catch((response) => {
                        console.log("API request %o to %o failed: %o", 'GET', '/api/amazon-set-order-reference-details', response);
                        this.resetProcessingCheckout();
                        reject(response)
                    });
                })
            },
            setOrderId: function() {
                return new Promise((resolve, reject) => {
                    // Get uuid from api
                    this.getUuid().then((response) => {
                        // Store uuid as orderId to order in store
                        this.setOrderIdInStore(response.data.substring(0, 20));
                        resolve();
                    });
                });
            },
            validateAndPlaceOrder: function(data) {

                // Clone order object to not mess up the order object in store
                this.orderClone = _.clone(this.order);

                // Set cart to order
                this.orderClone.cart = this.cart;

                // Set shipping costs to order
                _.assign(this.orderClone, {shippingCosts: this.shippingCosts});

                // Set customer to order
                _.assign(this.orderClone, {customer: null});

                this.setCustomerData(data).then(() => {

                    // Set address to order
                    _.assign(this.orderClone, {addresses: []});
                    this.setCustomerAdresses(data).then((res) => {

                        this.orderClone.addresses.push(res);

                        // Set StoreId from .env to identify order
                        if(_.isEmpty(process.env.STORE_ID)) {
                            console.log("Please set store id in env");
                            return;
                        }
                        this.orderClone.storeId = process.env.STORE_ID;

                        this.dispatchPlaceOrder();
                    });
                });

            },
            setCustomerData: function(data) {

                return new Promise((resolve) => {
                    // Add customer id, or generated uuid for guest user to order data
                    if(this.isLoggedIn) {
                        // Add customer to order
                        this.orderClone.customer = {
                            customerId: this.customer.customerData.id,
                            customerType: 'REG',
                            email: this.customer.customerData.email,
                            firstName: this.customer.customerData.firstname,
                            lastName: this.customer.customerData.lastname,
                        };
                        resolve();
                    }

                    if(!this.isLoggedIn) {

                        this.orderClone.customer = {
                            customerId: null,
                            customerType: 'GUEST',
                            email: data.GetOrderReferenceDetailsResponse.GetOrderReferenceDetailsResult.OrderReferenceDetails.Buyer.Email._text,
                            firstName: data.GetOrderReferenceDetailsResponse.GetOrderReferenceDetailsResult.OrderReferenceDetails.Buyer.Name._text,
                            lastName: data.GetOrderReferenceDetailsResponse.GetOrderReferenceDetailsResult.OrderReferenceDetails.Buyer.Name._text,
                        };

                        this.setCustomerAdresses(data).then((res) => {
                            let payload = {
                                baseData: {},
                                addresses: [res]
                            };

                            this.registerGuest(payload).then((response) => {
                                resolve();
                            });
                        });

                    }

                });

            },
            setCustomerAdresses: function(data) {

                let amazonAddressData = data.GetOrderReferenceDetailsResponse.GetOrderReferenceDetailsResult.OrderReferenceDetails.Destination.PhysicalDestination;

                let street = '';

                if("AddressLine1" in amazonAddressData) {
                    street += amazonAddressData.AddressLine1._text + ' ';
                }

                if("AddressLine2" in amazonAddressData) {
                    street += amazonAddressData.AddressLine2._text  + ' ';
                }

                if("AddressLine3" in amazonAddressData) {
                    street += amazonAddressData.AddressLine3._text;
                }

                return new Promise((resolve) => {
                    let address = {
                        id: null,
                        is_billing: true,
                        is_billing_default: true,
                        is_shipping: true,
                        is_shipping_default: true,
                        payload: {
                            gender: '',
                            firstName: amazonAddressData.Name._text,
                            lastName: '',
                            street: street,
                            houseNo: '',
                            postal: amazonAddressData.PostalCode._text,
                            city: amazonAddressData.City._text,
                            country: amazonAddressData.CountryCode._text,
                            company: ''
                        }
                    };

                    resolve(address);
                });

            },
            dispatchPlaceOrder: function() {

                // Order object holds every important data and is ready to be sent to api
                this.placeOrderAction({
                    order: JSON.stringify(this.orderClone)
                }).then((response) => {
                    // On request failure, throw error and keep order data
                    if(!response.data.success) {
                        axios({
                            method: 'POST',
                            url: '/api/hubble-logger',
                            data: {
                                level: "error",
                                msg: "Amazon Checkout dispatchPlaceOrder modApiPayment/placeOrder: %o",
                                payload: response.data
                            }
                        });
                        console.log(response.data.message);
                        this.resetProcessingCheckout();
                        return;
                    }

                    // GTM ONLY
                    if(this.$gtm) {

                        clearDataLayer().then(() => {
                            let revenue = this.orderClone.cart.grand_total;
                            let products = [];
                            let variant = null;
                            let tax = this.orderClone.cart.tax;

                            if(this.orderClone.cart.discount > 0) {
                                revenue = this.orderClone.cart.grand_total_with_discount;
                                tax = this.orderClone.cart.tax_with_discount;
                            }

                            _.forEach(this.orderClone.cart.items, (item) => {

                                if(!_.isEmpty(item.variants)) {
                                    variant = item.variants[0].value_id
                                }

                                let price = item.final_price_item.display_price_brutto;
                                if(this.productIsSpecial(item)) {
                                    price = item.final_price_item.display_price_brutto_special
                                }

                                products.push({
                                    'name': item.name_orig,     // Name or ID is required.
                                    'id': item.id,
                                    'price': price,
                                    'brand': item.manufacturer_name,
                                    'variant': variant,
                                    'quantity': item.qty
                                })
                            });

                            this.$gtm.pushEvent({
                                'event': 'purchase',
                                'ecommerce': {
                                    'purchase': {
                                        'actionField': {
                                            'id': this.orderClone.id,                         // Transaction ID. Required for purchases and refunds.
                                            'revenue': revenue,                     // Total transaction value (incl. tax and shipping)
                                            'tax': tax,
                                            'shipping': this.orderClone.shippingCosts,
                                        },
                                        'products': products
                                    },
                                    'add': undefined,
                                    'impressions': undefined,
                                    'detail': undefined,
                                    'remove': undefined,
                                    'click': undefined
                                }
                            });
                        });

                    }

                    // On request success clear data (order, cart)
                    // and redirect to success page
                    this.clearCart().then(() => {
                        this.clearOrder().then(() => {
                            this.resetProcessingCheckout();
                            this.$router.push({
                                path: this.localePath('checkout-success')
                            });
                        });
                    });
                }).catch((error) => {

                    this.resetProcessingCheckout();

                    axios({
                        method: 'POST',
                        url: '/api/hubble-logger',
                        data: {
                            level: "error",
                            msg: "Amazon Checkout dispatchPlaceOrder modApiPayment/placeOrder: %o",
                            payload: error
                        }
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
            }
        },

        head() {
            return {
                meta: [
                    { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' },
                    { hid: 'vp', name: 'viewport', content: 'width=device-width,initial-scale=1.0, maximum-scale=1.0' }
                ]
            }
        }
    }
</script>
