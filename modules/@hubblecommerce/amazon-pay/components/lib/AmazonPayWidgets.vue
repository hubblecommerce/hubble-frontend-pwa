<template>
    <div class="widget-wrp">
        <div id="addressBookWidgetDiv" />
        <div id="walletWidgetDiv" />
    </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
    name: 'AmazonPayWidgets',

    data() {
        return {
            orderReferenceId: null,
            countryCode: null,
            tableRates: null,
        };
    },

    computed: {
        ...mapState({
            cart: state => state.modCart.cart,
            processingCheckout: state => state.modApiPayment.processingCheckout,
        }),
    },

    mounted() {
        let moduleNamespace;
        if (this._hubbleAmazonPayOptions) {
            moduleNamespace = '$' + this._hubbleAmazonPayOptions.namespace;
        } else {
            moduleNamespace = '$hubble-amazon-pay';
        }

        if (window.OffAmazonPayments) {
            this.initAddressBookWidget();
        }

        if (typeof window.OffAmazonPayments === 'undefined') {
            this[moduleNamespace].loadAmazonScript().then(() => {
                this.initWidgets();
            });
        }
    },

    methods: {
        initWidgets: function () {
            window.onAmazonLoginReady = () => {
                window.amazon.Login.setClientId(process.env.LOGIN_WITH_AMAZON_CLIENT_ID);
                this.initAddressBookWidget();
                this.initWalletWidget();
            };
        },

        initAddressBookWidget: function () {
            new window.OffAmazonPayments.Widgets.AddressBook({
                sellerId: process.env.AMAZON_PAY_MERCHANT_ID,
                onOrderReferenceCreate: orderReference => {
                    this.orderReferenceId = orderReference.getAmazonOrderReferenceId();
                },
                onAddressSelect: () => {
                    // this select triggers payment select
                    this.$store.commit('modApiPayment/setProcessingCheckout');
                    this.getCountryCodeByOrderReference();
                },
                design: {
                    designMode: 'responsive',
                },
                onReady: () => {
                    // executed the address widget has been rendered.
                    // start checkout loader and reset checkout loader on payment select
                    this.$store.commit('modApiPayment/setProcessingCheckout');
                    this.$store.commit('modApiPayment/setExpressOrderReferenceId', this.orderReferenceId);
                    this.getCountryCodeByOrderReference();
                },
                onError: error => {
                    axios({
                        method: 'POST',
                        url: '/api/hubble-logger',
                        data: {
                            level: 'error',
                            msg: 'initAddressBookWidget onError: %s',
                            payload: error.getErrorMessage(),
                        },
                    });
                    if (error.getErrorCode() == 'ITP') {
                        // take no action -- allow interaction with widgets -- remove spinner/overlay if any
                        return;
                    }
                    if (error.getErrorCode() == 'BuyerSessionExpired') {
                        // take an action to move the customer to regular checkout, perhaps reroute to cart page
                        // send to the page which has a Amazon Pay Widgets(Button)
                        this.$router.push({
                            path: this.localePath('checkout-cart'),
                        });
                    }
                },
            }).bind('addressBookWidgetDiv');
        },

        initWalletWidget: function () {
            new window.OffAmazonPayments.Widgets.Wallet({
                sellerId: process.env.AMAZON_PAY_MERCHANT_ID,
                onPaymentSelect: orderReference => {
                    this.$store.commit('modApiPayment/resetProcessingCheckout');
                },
                design: {
                    designMode: 'responsive',
                },
                onError: function (error) {
                    axios({
                        method: 'POST',
                        url: '/api/hubble-logger',
                        data: {
                            level: 'error',
                            msg: 'initWalletWidget onError: %o',
                            payload: error.getErrorMessage(),
                        },
                    });
                    if (error.getErrorCode() == 'ITP') {
                        // take no action -- allow interaction with widgets -- remove spinner/overlay if any
                        return;
                    }
                    if (error.getErrorCode() == 'BuyerSessionExpired') {
                        // take an action to move the customer to regular checkout, perhaps reroute to cart page
                        // send to the page which has a Amazon Pay Widgets(Button)
                        this.$router.push({
                            path: this.localePath('checkout-cart'),
                        });
                    }
                },
            }).bind('walletWidgetDiv');
        },

        getOrderReferenceDetails: function (args) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'GET',
                    url: '/api/amazon-get-order-reference-details',
                    params: args,
                })
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch(response => {
                        axios({
                            method: 'POST',
                            url: '/api/hubble-logger',
                            data: {
                                level: 'error',
                                msg: 'API request POST to /api/amazon-get-order-reference-details failed: %o',
                                payload: response,
                            },
                        });
                        console.log('API request %o to %o failed: %o', 'POST', '/api/amazon-get-order-reference-details', response);
                        reject(response);
                    });
            });
        },

        getCountryCodeByOrderReference: function () {
            let args = {
                orderReferenceId: this.orderReferenceId,
            };
            this.getOrderReferenceDetails(args).then(data => {
                this.countryCode =
                    data.GetOrderReferenceDetailsResponse.GetOrderReferenceDetailsResult.OrderReferenceDetails.Destination.PhysicalDestination.CountryCode._text;
                this.precalculateShippingCost();
            });
        },

        precalculateShippingCost: function () {
            // Calculate shipping costs for chosen address
            this.$store
                .dispatch('modCart/precalculateShippingCost', {
                    order: JSON.stringify({
                        cart: this.cart,
                        country: this.countryCode,
                    }),
                })
                .then(response => {
                    // Check if send country code matches received country code, otherwise country is not allowed
                    if (response.data.order.shippingAllowed) {
                        //this.$store.commit('modApiPayment/resetProcessingCheckout');
                        this.$store.commit('modApiPayment/resetAmazonPayError', {
                            key: 'shippingCostsError',
                        });
                    } else {
                        this.$store.commit('modApiPayment/setAmazonPayError', {
                            key: 'shippingCostsError',
                            msg: this.$t('Shipping to this country is not allowed'),
                        });
                    }
                })
                .catch(error => {
                    this.$store.commit('modApiPayment/setAmazonPayError', {
                        key: 'shippingCostsError',
                        msg: 'Calculated Shipping costs failed: ' + error,
                    });
                    console.log('Calculated Shipping costs failed: ', error);
                });
        },
    },
};
</script>
