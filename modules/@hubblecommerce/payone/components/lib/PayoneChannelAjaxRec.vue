<template>
    <div />
</template>

<script>
    import {mapState} from 'vuex';
    import axios from 'axios';
    export default {
        name: "PayoneChannelAjaxRec",

        data() {
            return {
                requestData: {
                    aid : process.env.PAYONE_AID,
                    amount: '',
                    clearingtype: 'rec',
                    currency: 'EUR',
                    lastname: '',
                    mid : process.env.PAYONE_MID,
                    mode : process.env.PAYONE_MODE,
                    portalid : process.env.PAYONE_PORTALID,
                    reference : '',
                    request : 'authorization',
                    country: '',
                    hash : '',
                    key: ''
                },
                options: {
                    return_type : 'object',
                    callbackFunctionName: 'processPayoneResponse'
                }
            }
        },

        computed: {
            ...mapState({
                beforePlaceOrder: state => state.modApiPayment.beforePlaceOrder,
                cart: state => state.modCart.cart,
                customer: state => state.modApiPayment.customer,
                finalOrder: state => state.modApiPayment.finalOrder,
            }),
            amount: function() {
                // Get totals for coupons
                let total;
                if(this.cart.discount > 0) {
                    total = this.cart.grand_total_with_discount;
                } else {
                    total = this.cart.grand_total;
                }

                // Payone expects cent as amount unit
                let cent = total * 100;

                // Parse to int to prevent round error
                return parseInt(cent, 10);
            },
            lastName: function() {
                let lastName = '';
                // Set user data to request data
                _.forEach(this.customer.customerAddresses, (address) => {
                    if(address.is_billing_default) {
                        lastName = address.payload.lastName;
                    }
                });

                return lastName;
            },
            country: function() {
                let country = '';

                // Set user data to request data
                _.forEach(this.customer.customerAddresses, (address) => {
                    if(!_.isEmpty(address.payload.country.countries_iso_code_2)) {
                        country = address.payload.country.countries_iso_code_2;
                    }

                    if(_.isEmpty(address.payload.country.countries_iso_code_2)) {
                        country = address.payload.country;
                    }
                });

                return country;
            },
            reference: function() {
                return this.finalOrder.id;
            },
        },

        watch: {
            beforePlaceOrder: function() {
                this.submit();
            }
        },

        methods: {
            submit: function() {
                this.setDynamicRequestData().then(() => {
                    this.calcHash().then(() => {
                        let request = new Payone.ClientApi.Request(this.requestData, this.options);
                        request.send();
                    });
                })
            },
            calcHash: function() {
                return new Promise((resolve, reject) => {

                    axios({
                        method: 'GET',
                        url: '/api/calc-hash',
                        params: this.requestData,
                    }).then((response) => {
                        this.requestData = response.data;
                        resolve();
                    }).catch((response) => {
                        console.log("API request %o to %o failed: %o", 'GET', '/api/calc-hash', response);
                        reject(response);
                    });

                })
            },
            setDynamicRequestData: function() {
                return new Promise((resolve) => {
                    this.requestData.amount = this.amount;
                    this.requestData.lastname = this.lastName;
                    this.requestData.country = this.country;
                    this.requestData.reference = this.reference;
                    resolve();
                });
            }
        }
    }
</script>
