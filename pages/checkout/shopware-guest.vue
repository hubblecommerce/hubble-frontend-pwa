<template>
    <div class="container checkout-summary amazon-pay">
        <div class="checkout-summary-wrp" style="max-width: 525px; margin: auto;">
            <div class="headline headline-1 mt-4" v-text="'Checkout'" />

            <div class="checkout-login-desktop-wrp">
                <div class="guest-login-wrp">
                    <div class="headline headline-3 mb-3">Customerinformation</div>
                    <validation-observer ref="observer" v-slot="{ passes, invalid, validate }" tag="form" class="form-edit register-form" @submit.prevent="validate().then((e) => {submitForm(e)})">
                        <div class="base-data-wrp">
                            <validation-provider v-slot="{ errors }" vid="email" name="email" rules="required|email" mode="passive" tag="div" class="hbl-input-group">
                                <input id="email"
                                       v-model="orderObj.email"
                                       type="text"
                                       name="email"
                                       value=""
                                       :class="{invalid: errors.length > 0}"
                                       placeholder=" "
                                       required
                                >
                                <label for="email" v-text="$t('Email Address')+'*'" />
                                <div class="validation-msg" v-text="$t(errors[0])" />
                            </validation-provider>
                        </div>

                        <div class="checkout-payment-wrp">
                            <div class="payment-methods-wrp">
                                <div class="headline headline-3" v-text="$t('Payment')" />
                                <div class="method-wrp cc">
                                    <div class="hbl-checkbox">
                                        <input id="payment-option-cc" v-model="chosenPaymentMethod" type="radio" :value="'1'">
                                        <label for="payment-option-cc" class="method-label">
                                            <span class="name" v-text="'For Free'" />
                                            <i class="icon icon-payment" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="shipping-methods-wrp">
                            <div class="headline headline-3" v-text="$t('Shipping methods')" />
                            <div class="method-wrp hbl-checkbox">
                                <input :id="'shipping-option-1'" v-model="chosenShippingMethod" type="radio" :value="'1'">
                                <label :for="'shipping-option-1'" class="method-label">
                                    <span class="name" v-text="'Pick up'" />
                                    <span class="description" v-text="'Visit us'" />
                                    <i class="icon icon-truck" />
                                </label>
                            </div>
                        </div>

                        <div class="terms-and-conditions text">
                            {{ $t('By submitting your order, you confirm that you have read and accepted our') }}
                            <nuxt-link :to="$t('link-terms-and-conditions')">
                                {{ $t('terms and conditions.') }}
                            </nuxt-link>
                        </div>

                        <div class="summary-container">
                            <div class="summary-wrp">
                                <totals />
                                <div v-for="(msg, key) in Object.keys(checkoutError)" :key="key" class="errors">
                                    {{ checkoutError[msg] }}
                                </div>
                                <button class="button-primary checkout-btn" :disabled="processingCheckout || !isEmpty(checkoutError)" @click.prevent="validate().then((e) => {submitForm(e)})">
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

                    </validation-observer>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import axios from 'axios';
    import Totals from "../../components/checkout/Totals";

    export default {
        name: "ShopwareGuest",

        components: {Totals},

        middleware: [
            'cartValidate',
            'apiLocalization',
            'trackClickPath'
        ],

        layout: 'hubble_express',

        data() {
            return {
                chosenPaymentMethod: '1',
                chosenShippingMethod: '1',
                checkoutError: {},
                processingCheckout: false,
                orderObj: {
                    salutationId: "",
                    firstName: "Guest",
                    lastName: "Customer",
                    email: "",
                    billingAddress: {
                        salutationId: "",
                        street: "Test Street",
                        zipcode: "12345",
                        city: "City",
                        countryId: ""
                    }
                }
            }
        },

        computed: {
            ...mapState({
                swtc: state => state.modCart.swtc
            })
        },

        methods: {
            isEmpty: function(val) {
                return _.isEmpty(val);
            },

            placeOrder: function() {

                this.processingCheckout = true;

                this.$store.dispatch('modApiPayment/placeOrder', {order: this.orderObj, swtc: this.swtc}).then(() => {

                    // On request success clear data (cart)
                    // and redirect to success page
                    this.$store.dispatch('modCart/clearAll').then(() => {
                        this.$router.push({
                            path: this.localePath('checkout-shopware-success')
                        }, () => {
                            this.processingCheckout = false;
                        });
                    });

                });

            },

            submitForm: function(isValid) {

                if(isValid && !this.processingCheckout) {
                    this.placeOrder();
                    return;
                }

                this.processingCheckout = false;
                return false;
            }
        },

        head() {
            return {
                title: 'Checkout | Hubble Demo-Shop',
                meta: [
                    { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' },
                    { hid: 'vp', name: 'viewport', content: 'width=device-width,initial-scale=1.0, maximum-scale=1.0' }
                ]
            }
        }
    }
</script>

<style lang="scss">
    .icon-payment, .icon-truck {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
        height: 24px;
        font-size: 25px;
        color: #888;
    }

    .icon-truck {
        font-size: 24px;
    }
</style>
