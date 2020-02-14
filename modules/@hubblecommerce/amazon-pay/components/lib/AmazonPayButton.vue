<template>
    <div class="amazon-pay-button-wrp">
        <transition name="fade">
            <div v-show="!loading" id="AmazonPayButton" />
        </transition>
        <div v-if="scriptError" v-text="scriptError" />
    </div>
</template>

<script>
    import axios from 'axios';
    import { mapState } from 'vuex';
    export default {
        name: "AmazonPayButton",

        data() {
            return {
                orderId: '',
                scriptError: false,
                loading: false
            }
        },

        computed: {
            ...mapState({
                cart: state => state.modCart.cart,
            }),
            amount: function() {
                return this.cart.grand_total.toFixed(2);
            }
        },

        mounted() {

            this.loading = true;

            let moduleNamespace;
            if(this._hubbleAmazonPayOptions) {
                moduleNamespace = '$'+this._hubbleAmazonPayOptions.namespace;
            } else {
                moduleNamespace = '$hubble-amazon-pay';
            }

            this[moduleNamespace].loadAmazonScript().then(() => {

                this.$store.dispatch('modApiPayment/getUuid').then((response) => {
                    this.orderId = response.data.substring(0, 20);

                    if(_.isEmpty(process.env.AMAZON_PAY_MODE) || process.env.AMAZON_PAY_MODE === 'api_integration') {
                        this.initButton();
                        this.loading = false;
                    }

                    if(process.env.AMAZON_PAY_MODE === 'express_custom_integration') {
                        this.initExpressButton();
                    }

                });
            }).catch((error) => {
                this.scriptError = error;
                this.loading = false;
            });
        },

        methods: {
            initButton: function() {

                // Set client id before init the button
                window.amazon.Login.setClientId(process.env.LOGIN_WITH_AMAZON_CLIENT_ID);

                window.OffAmazonPayments.Button("AmazonPayButton", process.env.AMAZON_PAY_MERCHANT_ID, {
                    type: 'PwA', // LwA = Login Button || PwA = Pay Button
                    authorization: () => {
                        let loginOptions = {
                            scope: "profile payments:widget payments:shipping_address", // Recommended scope
                            popup: true // Open login dialog in popup or not
                        };
                        let authRequest = amazon.Login.authorize(
                            loginOptions,
                            process.env.APP_BASE_URL+"/checkout/amazon" // Redirect Url
                        );
                    },
                    onError: (error) => {
                        axios({
                            method: 'POST',
                            url: '/api/hubble-logger',
                            data: {
                                level: "error",
                                msg: "initButton AmazonPayButton onError: %o",
                                payload: error
                            }
                        });
                    }
                });

            },
            initExpressButton: function() {
                let sellerID = process.env.AMAZON_PAY_MERCHANT_ID;

                window.OffAmazonPayments.Button("AmazonPayButton", sellerID, {
                    type: "hostedPayment",
                    hostedParametersProvider: (done) => {
                        let args = {
                            amount: this.amount,
                            sellerNote: 'Thank you for your order.',
                            sellerOrderId: this.orderId
                        };
                        this.getSignature(args).then((data) => {
                            done(data);
                        })
                    },
                    onError: (error) => {
                        axios({
                            method: 'POST',
                            url: '/api/hubble-logger',
                            data: {
                                level: "error",
                                msg: "initExpressButton AmazonPayButton onError: %o",
                                payload: error
                            }
                        });
                    }
                });
            },
            getSignature: function(args) {
                return new Promise((resolve, reject) => {
                    axios({
                        method: 'GET',
                        url: '/api/calc-signature-auth-and-capture',
                        params: args,
                    }).then((response) => {
                        resolve(response.data);
                    }).catch((response) => {
                        axios({
                            method: 'POST',
                            url: '/api/hubble-logger',
                            data: {
                                level: "error",
                                msg: "getSignature API request GET to /api/calc-signature-auth-and-capture failed: %o",
                                payload: response
                            }
                        });
                        console.log("API request %o to %o failed: %o", 'GET', '/api/calc-signature-auth-and-capture', response);
                        reject(response)
                    });
                });
            }
        }
    }
</script>
