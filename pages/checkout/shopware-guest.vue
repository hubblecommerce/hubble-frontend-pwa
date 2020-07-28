<template>
    <div class="container checkout-summary amazon-pay">
        <div class="checkout-summary-wrp" style="max-width: 525px; margin: auto;">
            <div class="headline headline-1 mt-4" v-text="'Checkout'" />

            <div class="checkout-login-desktop-wrp">
                <div class="guest-login-wrp">

                    <!--
                    ************************
                    Addressdata
                    ************************
                    -->
                    <div class="headline headline-3 mb-3">Customerinformation</div>
                    <validation-observer ref="observer" v-slot="{ passes, invalid, validate }" tag="form" class="form-edit register-form" @submit.prevent="validate().then((e) => {submitForm(e)})">
                        <div class="base-data-wrp">
                            <validation-provider v-slot="{ errors }" name="salutation" rules="required" mode="eager" tag="div" class="hbl-select">
                                <select v-model="orderObj.salutationId" class="select-text" :class="{invalid: errors.length > 0}" required>
                                    <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">{{ salutation.displayName }}</option>
                                </select>
                                <label class="select-label" v-text="$t('Salutation')+'*'" />
                                <div class="validation-msg" v-text="$t(errors[0])" />
                            </validation-provider>

                            <validation-provider v-slot="{ errors }" vid="email" name="email" rules="required|email" mode="eager" tag="div" class="hbl-input-group">
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

                            <validation-provider v-slot="{ errors }" vid="firstName" name="firstName" rules="required" mode="eager" tag="div" class="hbl-input-group">
                                <input id="firstName"
                                       v-model="orderObj.firstName"
                                       type="text"
                                       name="firstName"
                                       value=""
                                       :class="{invalid: errors.length > 0}"
                                       placeholder=" "
                                       required
                                >
                                <label for="firstName" v-text="$t('First Name')+'*'" />
                                <div class="validation-msg" v-text="$t(errors[0])" />
                            </validation-provider>

                            <validation-provider v-slot="{ errors }" vid="lastName" name="lastName" rules="required" mode="eager" tag="div" class="hbl-input-group">
                                <input id="lastName"
                                       v-model="orderObj.lastName"
                                       type="text"
                                       name="lastName"
                                       value=""
                                       :class="{invalid: errors.length > 0}"
                                       placeholder=" "
                                       required
                                >
                                <label for="lastName" v-text="$t('Last Name')+'*'" />
                                <div class="validation-msg" v-text="$t(errors[0])" />
                            </validation-provider>

                            <validation-provider v-slot="{ errors }" vid="street" name="street" rules="required" mode="eager" tag="div" class="hbl-input-group">
                                <input id="street"
                                       v-model="orderObj.billingAddress.street"
                                       type="text"
                                       name="street"
                                       value=""
                                       :class="{invalid: errors.length > 0}"
                                       placeholder=" "
                                       required
                                >
                                <label for="street" v-text="$t('Street')+'*'" />
                                <div class="validation-msg" v-text="$t(errors[0])" />
                            </validation-provider>

                            <div class="form-row zip-city">
                                <validation-provider v-slot="{ errors }" name="zipcode" rules="required|numeric|max:5" mode="eager" tag="div" class="hbl-input-group">
                                    <input id="zipCode"
                                           v-model="orderObj.billingAddress.zipcode"
                                           type="text"
                                           name="zipCode"
                                           value=""
                                           :class="{invalid: errors.length > 0}"
                                           placeholder=" "
                                           required
                                    >
                                    <label for="zipCode" v-text="$t('Zipcode')+'*'" />
                                    <div class="validation-msg" v-text="$t(errors[0])" />
                                </validation-provider>

                                <validation-provider v-slot="{ errors }" name="city" rules="required|max:30" mode="eager" tag="div" class="hbl-input-group">
                                    <input id="city"
                                           v-model="orderObj.billingAddress.city"
                                           type="text"
                                           name="city"
                                           value=""
                                           :class="{invalid: errors.length > 0}"
                                           placeholder=" "
                                           required
                                    >
                                    <label for="city" v-text="$t('City')+'*'" />
                                    <div class="validation-msg" v-text="$t(errors[0])" />
                                </validation-provider>

                                <validation-provider v-slot="{ errors }" name="country" rules="required" mode="eager" tag="div" class="hbl-select">
                                    <select v-model="orderObj.billingAddress.countryId" class="select-text" :class="{invalid: errors.length > 0}" required>
                                        <option v-if="country.active && country.shippingAvailable" v-for="country in countries" :key="country.id" :value="country.id">{{ country.name }}</option>
                                    </select>
                                    <label class="select-label" v-text="$t('Country')+'*'" />
                                    <div class="validation-msg" v-text="$t(errors[0])" />
                                </validation-provider>
                            </div>
                        </div>

                        <!--
                        ************************
                        Payment
                        ************************
                        -->
                        <payment-methods />

                        <!--
                        ************************
                        Shipping
                        ************************
                        -->
                        <shipping-methods />

                        <!--
                        ************************
                        ToC
                        ************************
                        -->
                        <div class="terms-and-conditions text">
                            {{ $t('By submitting your order, you confirm that you have read and accepted our') }}
                            <nuxt-link :to="$t('link-terms-and-conditions')">
                                {{ $t('terms and conditions.') }}
                            </nuxt-link>
                        </div>

                        <!--
                        ************************
                        Summary
                        ************************
                        -->
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

                        <template v-for="error in errors">
                            <div class="error-message" v-text="error" />
                        </template>
                    </validation-observer>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex';
    import Totals from "../../components/checkout/Totals";
    import PaymentMethods from "../../components/checkout/PaymentMethods";
    import ShippingMethods from "../../components/checkout/ShippingMethods";
    import { addBackendErrors } from "@hubblecommerce/hubble/core/utils/formMixins";
    import _ from 'lodash';
    import cartValidate from '@hubblecommerce/hubble/core/anonymous-middleware/cartValidate'

    export default {
        name: "ShopwareGuest",

        components: {ShippingMethods, PaymentMethods, Totals},

        middleware: [
            cartValidate,
            'apiLocalization',
            'trackClickPath'
        ],

        mixins : [addBackendErrors],

        layout: 'hubble_express',

        data() {
            return {
                checkoutError: {},

                orderObj: {
                    salutationId: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    billingAddress: {
                        salutationId: "",
                        street: "",
                        zipcode: "",
                        city: "",
                        countryId: ""
                    }
                },

                errors: []
            }
        },

        computed: {
            ...mapState({
                swtc: state => state.modCart.swtc,
                countries: state => state.modApiCustomer.countries,
                salutations: state => state.modApiCustomer.salutations,
                processingCheckout: state => state.modApiPayment.processingCheckout,
                cart: state => state.modCart.cart,
            })
        },

        mounted() {
            // Set cart context as customer context for further api calls
            // Do this after swtc isset via cookie (mounted)

            if(_.isEmpty(this.$store.state.modApiCustomer.customer.customerAuth)) {
                this.setCustomerAuth({token: this.$store.state.modCart.swtc});
            }

            this.swGetSalutations()
                .then((salutationResponse) => {
                    this.setSalutations(salutationResponse.data.data);

                })
                .catch((err) => {
                    console.log("swGetSalutations error: ", err);

                    if (!this.errors.includes("No network connection")) {
                        _.forEach(this.addBackendErrors(err), error => {
                            this.errors.push(error);
                        })
                    }
                });

            this.swGetCountries()
                .then((countryResponse) => {
                    this.setCountries(countryResponse.data.data);
                })
                .catch((err) => {
                    console.log("swGetCountries error: ", err);

                    if (!this.errors.includes("No network connection")) {
                        _.forEach(this.addBackendErrors(err), error => {
                            this.errors.push(error);
                        })
                    }
                });
        },

        methods: {
            ...mapMutations({
                setSalutations: 'modApiCustomer/setSalutations',
                setCountries: 'modApiCustomer/setCountries',
                setProcessingCheckout: 'modApiPayment/setProcessingCheckout',
                resetProcessingCheckout: 'modApiPayment/resetProcessingCheckout',
                setCustomerAuth: 'modApiCustomer/setCustomerAuth',
            }),
            ...mapActions({
                placeGuestOrder: 'modApiPayment/placeGuestOrder',
                swStartPayment: 'modApiPayment/swStartPayment',
                validateOrder: 'modApiPayment/validateOrder',
                swGetSalutations: 'modApiCustomer/swGetSalutations',
                swGetCountries: 'modApiCustomer/swGetCountries'
            }),
            isEmpty: function(val) {
                return _.isEmpty(val);
            },
            placeOrder: function() {

                this.setProcessingCheckout();

                // Place order
                // on success: clear cart and order and
                // set response context token as new customer auth token (needed for payment)
                this.placeGuestOrder({order: this.orderObj, swtc: this.swtc})
                    .then((order) => {

                        // Init payment
                        this.swStartPayment(order.data.data.id)
                            .then((paymentResponse) => {

                                // Reset cart context token as new customer auth token
                                // because order context token is not needed anymore
                                this.setCustomerAuth({});

                                if(paymentResponse.data.paymentUrl) {
                                    this.resetProcessingCheckout();
                                    window.open(paymentResponse.data.paymentUrl, "_self");
                                }

                                if(_.isEmpty(paymentResponse.data)) {
                                    this.$router.push({
                                        path: this.localePath('checkout-shopware-success')
                                    }, () => {
                                        this.resetProcessingCheckout();
                                    });
                                }

                            })
                            .catch((err) => {
                                console.log("swStartPayment error: ", err);
                            });

                    })
                    .catch((err) => {
                        console.log("placeGuestOrder error: ", err);

                        this.errors.push(this.$t('Order could not be placed successfully'));

                        _.forEach(this.addBackendErrors(err), error => {
                            this.errors.push(error);
                        })
                    });

            },

            submitForm: async function(isValid) {

                try {
                    await this.validateOrder();
                } catch(error) {
                    this.resetProcessingCheckout();
                    return false;
                }

                if(isValid && !this.processingCheckout) {
                    this.placeOrder();
                    return;
                }

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
    .summary-container {
        max-width: none;
        margin-left: 0;
        width: 100%;
    }

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
