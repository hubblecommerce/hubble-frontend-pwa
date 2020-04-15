<template>
    <validation-observer ref="observer" v-slot="{ passes }" tag="form" class="form-edit register-form" @submit.prevent="passes(submitRegisterForm)">
        <div class="base-data-wrp">
            <validation-provider v-slot="{ errors }" vid="email" name="email" rules="required|email" mode="passive" tag="div" class="hbl-input-group">
                <input
                    id="email"
                    v-model="form.baseData.email"
                    type="text"
                    name="email"
                    value=""
                    :class="{ invalid: errors.length > 0 }"
                    placeholder=" "
                    required
                >

                <label for="email" v-text="$t('Email Address') + '*'" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>

            <validation-provider
                v-slot="{ errors }"
                name="email-repeat"
                rules="required|confirmed:email"
                mode="passive"
                tag="div"
                class="hbl-input-group"
            >
                <input
                    id="email-repeat"
                    v-model="form.baseData.emailRepeat"
                    type="text"
                    name="email"
                    value=""
                    :class="{ invalid: errors.length > 0 }"
                    placeholder=" "
                    required
                    @paste="onPaste($event)"
                >

                <label for="email-repeat" v-text="$t('Repeat Email Address') + '*'" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>

            <div class="hbl-input-group">
                <input id="phone" v-model="form.baseData.phone" type="text" name="phone" value="" placeholder=" " />

                <label for="phone" v-text="$t('Phone')" />
            </div>

            <validation-provider v-slot="{ errors }" name="birthday" rules="birthday" mode="passive" tag="div" class="hbl-input-group input-icon">
                <input
                    id="birthday"
                    v-model="form.baseData.birthday"
                    type="text"
                    name="birthday"
                    value=""
                    :class="{ invalid: errors.length > 0 }"
                    placeholder=" "
                >

                <label for="birthday" v-text="$t('Birthday')" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>

            <template v-if="!guest">
                <validation-provider
                    v-slot="{ errors }"
                    vid="password"
                    name="password"
                    rules="required|password:4"
                    mode="passive"
                    tag="div"
                    class="hbl-input-group"
                >
                    <input
                        id="password"
                        v-model="form.baseData.password"
                        type="password"
                        name="password"
                        autocomplete="on"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="password" v-text="$t('Password') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider
                    v-slot="{ errors }"
                    name="password confirmation"
                    rules="required|confirmed:password"
                    mode="passive"
                    tag="div"
                    class="hbl-input-group"
                >
                    <input
                        id="passwordRepeat"
                        v-model="passwordRepeat"
                        type="password"
                        name="passwordRepeat"
                        autocomplete="on"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="passwordRepeat" v-text="$t('Password repeat') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>
            </template>
        </div>

        <div class="billing-addresses-wrp">
            <div v-if="alternativeShippingAddress" class="headline headline-3" v-text="$t('My Billing Address')" />
            <div v-else class="headline headline-3" v-text="$t('Address')" />

            <div v-if="alternativeShippingAddress" class="different-shipping-address">
                <div class="hbl-checkbox">
                    <input id="differentShippingAddress" v-model="differentShippingAddress" type="checkbox" />
                    <label for="differentShippingAddress" v-text="$t('I have a different shipping address')" />
                </div>
            </div>

            <validation-provider v-slot="{ errors }" name="gender" rules="required" mode="passive" tag="div" class="hbl-select">
                <select v-model="form.addresses[0].payload.gender" class="select-text" :class="{ invalid: errors.length > 0 }" required>
                    <option v-for="salutation in salutations" :key="salutation.key" :value="salutation.key">{{ salutation.value }}</option>
                </select>

                <label class="select-label" v-text="$t('Salutation') + '*'" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>

            <validation-provider v-slot="{ errors }" name="firstName" rules="required|max:30" mode="passive" tag="div" class="hbl-input-group">
                <input
                    id="billingFirstName"
                    v-model="form.addresses[0].payload.firstName"
                    type="text"
                    name="billingFirstName"
                    value=""
                    :class="{ invalid: errors.length > 0 }"
                    placeholder=" "
                    required
                >

                <label for="billingFirstName" v-text="$t('First Name') + '*'" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>

            <validation-provider v-slot="{ errors }" name="lastName" rules="required|max:30" mode="passive" tag="div" class="hbl-input-group">
                <input
                    id="billingLastName"
                    v-model="form.addresses[0].payload.lastName"
                    type="text"
                    name="billingLastName"
                    value=""
                    :class="{ invalid: errors.length > 0 }"
                    placeholder=" "
                    required
                >

                <label for="billingLastName" v-text="$t('Last Name') + '*'" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>

            <template v-if="streetIncludesHouseNo">
                <validation-provider v-slot="{ errors }" name="street" rules="required|max:60" mode="passive" tag="div" class="hbl-input-group">
                    <input
                        id="billingStreet"
                        v-model="form.addresses[0].payload.street"
                        type="text"
                        name="billingStreet"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="billingStreet" v-text="$t('Street') + '/' + $t('Houseno.') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>
            </template>

            <div v-else class="form-row street-nr">
                <validation-provider v-slot="{ errors }" name="street" rules="required|max:60" mode="passive" tag="div" class="hbl-input-group">
                    <input
                        id="billingStreet"
                        v-model="form.addresses[0].payload.street"
                        type="text"
                        name="billingStreet"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="billingStreet" v-text="$t('Street') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="houseNo" rules="required|max:5" mode="passive" tag="div" class="hbl-input-group">
                    <input
                        id="billingHouseNr"
                        v-model="form.addresses[0].payload.houseNo"
                        type="text"
                        name="billingHouseNr"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="billingHouseNr" v-text="$t('Houseno.') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>
            </div>

            <div class="form-row zip-city">
                <validation-provider
                    v-slot="{ errors }"
                    name="postal"
                    rules="required|numeric|max:5"
                    mode="passive"
                    tag="div"
                    class="hbl-input-group"
                >
                    <input
                        id="billingZipCode"
                        v-model="form.addresses[0].payload.postal"
                        type="text"
                        name="billingZipCode"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="billingZipCode" v-text="$t('Zipcode') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="city" rules="required|max:30" mode="passive" tag="div" class="hbl-input-group">
                    <input
                        id="billingCity"
                        v-model="form.addresses[0].payload.city"
                        type="text"
                        name="billingCity"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="billingCity" v-text="$t('City') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>
            </div>

            <validation-provider v-slot="{ errors }" name="country" rules="required" mode="passive" tag="div" class="hbl-select">
                <select v-model="form.addresses[0].payload.country" class="select-text" :class="{ invalid: errors.length > 0 }" required>
                    <option v-for="country in countries" :key="country.iso_code_2" :value="country.iso_code_2">{{ country.name }}</option>
                </select>

                <label class="select-label" v-text="$t('Country') + '*'" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>
        </div>

        <validation-observer v-if="differentShippingAddress && alternativeShippingAddress" class="shipping-addresses-wrp" tag="div">
            <div class="headline headline-3" v-text="$t('My Shipping Address (not billing address)')" />

            <validation-provider v-slot="{ errors }" name="gender" rules="required" mode="passive" tag="div" class="hbl-select">
                <select v-model="form.addresses[1].payload.gender" class="select-text" :class="{ invalid: errors.length > 0 }" required>
                    <option v-for="salutation in salutations" :key="salutation.key" :value="salutation.key">{{ salutation.value }}</option>
                </select>

                <label class="select-label" v-text="$t('Salutation') + '*'" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>

            <validation-provider v-slot="{ errors }" name="firstName" rules="required|max:30" mode="passive" tag="div" class="hbl-input-group">
                <input
                    id="shippingFirstName"
                    v-model="form.addresses[1].payload.firstName"
                    type="text"
                    name="shippingFirstName"
                    value=""
                    :class="{ invalid: errors.length > 0 }"
                    placeholder=" "
                    required
                >

                <label for="shippingFirstName" v-text="$t('First Name') + '*'" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>

            <validation-provider v-slot="{ errors }" name="lastName" rules="required|max:30" mode="passive" tag="div" class="hbl-input-group">
                <input
                    id="shippingLastName"
                    v-model="form.addresses[1].payload.lastName"
                    type="text"
                    name="shippingLastName"
                    value=""
                    :class="{ invalid: errors.length > 0 }"
                    placeholder=" "
                    required
                >

                <label for="shippingLastName" v-text="$t('Last Name') + '*'" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>

            <template v-if="streetIncludesHouseNo">
                <validation-provider v-slot="{ errors }" name="street" rules="required|max:60" mode="passive" tag="div" class="hbl-input-group">
                    <input
                        id="shippingStreet"
                        v-model="form.addresses[1].payload.street"
                        type="text"
                        name="shippingStreet"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="shippingStreet" v-text="$t('Street') + '/' + $t('Houseno.') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>
            </template>

            <div v-else class="form-row street-nr">
                <validation-provider v-slot="{ errors }" name="street" rules="required|max:60" mode="passive" tag="div" class="hbl-input-group">
                    <input
                        id="shippingStreet"
                        v-model="form.addresses[1].payload.street"
                        type="text"
                        name="shippingStreet"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="shippingStreet" v-text="$t('Street') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="houseNo" rules="required|max:5" mode="passive" tag="div" class="hbl-input-group">
                    <input
                        id="shippingHouseNr"
                        v-model="form.addresses[1].payload.houseNo"
                        type="text"
                        name="shippingHouseNr"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="shippingHouseNr" v-text="$t('Houseno.') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>
            </div>

            <div class="form-row zip-city">
                <validation-provider
                    v-slot="{ errors }"
                    name="postal"
                    rules="required|numeric|max:5"
                    mode="passive"
                    tag="div"
                    class="hbl-input-group"
                >
                    <input
                        id="shippingZipCode"
                        v-model="form.addresses[1].payload.postal"
                        type="text"
                        name="shippingZipCode"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="shippingZipCode" v-text="$t('Zipcode') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="city" rules="required|max:30" mode="passive" tag="div" class="hbl-input-group">
                    <input
                        id="shippingCity"
                        v-model="form.addresses[1].payload.city"
                        type="text"
                        name="shippingCity"
                        value=""
                        :class="{ invalid: errors.length > 0 }"
                        placeholder=" "
                        required
                    >

                    <label for="shippingCity" v-text="$t('City') + '*'" />

                    <div class="validation-msg" v-text="$t(errors[0])" />
                </validation-provider>
            </div>

            <validation-provider v-slot="{ errors }" name="country" rules="required" mode="passive" tag="div" class="hbl-select">
                <select v-model="form.addresses[1].payload.country" class="select-text" :class="{ invalid: errors.length > 0 }" required>
                    <option v-for="country in countries" :key="country.iso_code_2" :value="country.iso_code_2">{{ country.name }}</option>
                </select>

                <label class="select-label" v-text="$t('Country') + '*'" />

                <div class="validation-msg" v-text="$t(errors[0])" />
            </validation-provider>
        </validation-observer>

        <validation-provider
            v-slot="{ errors }"
            name="privacyPolicy"
            :rules="{ required: { allowFalse: false } }"
            mode="passive"
            tag="div"
            class="hbl-checkbox"
        >
            <input id="privacyPolicy" v-model="privacyPolicy" type="checkbox" :class="{ invalid: errors.length > 0 }" />

            <label for="privacyPolicy">
                {{ $t('I have read the ') }}<nuxt-link :to="$t('link-privacy-policy')">{{ $t('privacy policy.') }}*</nuxt-link>
            </label>

            <div class="validation-msg" v-text="$t(errors[0])" />
        </validation-provider>

        <div class="error-message" v-text="error" />

        <button v-if="guest" class="button-primary" :disabled="processingRegister" @click.prevent="passes(submitRegisterGuestForm)">
            <span v-if="!processingRegister">{{ $t('Guest order') }}</span>

            <div v-if="processingRegister" class="loader register-loader lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
            </div>

            <material-ripple />
        </button>
        <button v-else class="button-primary" :disabled="processingRegister" @click.prevent="passes(submitRegisterForm)">
            <span v-if="!processingRegister">{{ $t('Register') }}</span>

            <div v-if="processingRegister" class="loader register-loader lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
            </div>

            <material-ripple />
        </button>

        <div class="key-info">
            <div class="text-small">{{ $t('* Required information is marked with an asterisk.') }}</div>
            <div class="text-small">{{
                $t(
                    '** We regularly send you carefully selected offers from our range by e-mail. All personal data requested during the newsletter registration will not be passed on to third parties. You may object to the use of your e-mail address for promotional purposes at any time online or through an informal e-mail.'
                )
            }}</div>
        </div>
    </validation-observer>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import Form from '@hubblecommerce/hubble/core/utils/form';
import { addBackendErrors, salutations } from '@hubblecommerce/hubble/core/utils/formMixins';

export default {
    name: 'RegisterForm',

    mixins: [addBackendErrors, salutations],

    props: {
        guest: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data() {
        return {
            curComponent: 'view-auth',

            processingRegister: false,

            streetIncludesHouseNo: process.env.STREETINFO_INCLUDES_HOUSENO === 'true',
            alternativeShippingAddress: process.env.ALTERNATIVE_SHIPPING_ADDRESS === 'true',

            differentShippingAddress: false,
            privacyPolicy: false,

            passwordRepeat: '',

            form: new Form({
                baseData: {
                    id: '',
                    name: '',
                    birthday: '',
                    phone: '',
                    email: '',
                    password: '',
                },
                addresses: [
                    {
                        id: 0,
                        is_billing: true,
                        is_billing_default: true,
                        is_shipping: true,
                        is_shipping_default: true,
                        payload: {
                            gender: '',
                            firstName: '',
                            lastName: '',
                            street: '',
                            houseNo: '',
                            postal: '',
                            city: '',
                            country: 'DE',
                            company: '',
                        },
                    },
                    {
                        id: 0,
                        is_billing: false,
                        is_billing_default: false,
                        is_shipping: true,
                        is_shipping_default: true,
                        payload: {
                            gender: '',
                            firstName: '',
                            lastName: '',
                            street: '',
                            houseNo: '',
                            postal: '',
                            city: '',
                            country: 'DE',
                            company: '',
                        },
                    },
                ],
            }),

            error: null,
        };
    },

    computed: {
        ...mapState({
            wishlistState: state => state.modWishlist.wishlistItemsObj,
            wishlistQty: state => state.modWishlist.wishlistItemsCount,
            customer: state => state.modApiCustomer.customer,
            countries: state => state.modApiCustomer.availableCountries,
        }),
    },

    mounted() {
        if (_.isEmpty(this.countries)) {
            this.getAvailableCountries();
        }
    },

    methods: {
        ...mapActions({
            getAvailableCountries: 'modApiCustomer/getAvailableCountries',
            register: 'modApiCustomer/register',
            postWishlist: 'modApiCustomer/postWishlist',
            storeCustomerAddress: 'modApiCustomer/storeCustomerAddress',
            saveToStore: 'modWishlist/saveToStore',
            registerGuest: 'modApiCustomer/registerGuest',
        }),
        ...mapMutations({
            setWishlistId: 'modWishlist/setWishlistId',
        }),
        submitRegisterForm: function () {
            this.processingRegister = true;

            // Set first address to shipping address to false
            if (this.differentShippingAddress) {
                this.form.addresses[0].is_shipping = false;
            }

            // remove house number from payload object if street includes it
            if (this.streetIncludesHouseNo) {
                this.form.addresses[0].payload = _.omit(this.form.addresses[0].payload, 'houseNo');
                this.form.addresses[1].payload = _.omit(this.form.addresses[1].payload, 'houseNo');
            }

            // Api requires name property, so create name from billing first and last name
            let name = this.form.addresses[0].payload.firstName + ' ' + this.form.addresses[0].payload.lastName;
            let email = this.form.baseData.email;
            let password = this.form.baseData.password;
            let passwordConfirm = this.form.baseData.password;
            let address = this.form.addresses[0].payload;
            let birthday = this.form.baseData.birthday;
            let phoneNumber = this.form.baseData.phone;

            // Extract data for api to handle
            let userData = {
                name: name,
                email: email,
                password: password,
                password_confirm: passwordConfirm,
                address: address,
                birthday: birthday,
                phoneNumber: phoneNumber,
            };

            // Register new customer
            this.register(userData)
                .then(() => {
                    let creds = {
                        email: userData.email,
                        password: userData.password,
                    };

                    // Save wishlist
                    this.postWishlist({
                        user_id: this.customer.customerData.id,
                        wishlist: {
                            qty: this.wishlistQty,
                            items: this.wishlistState,
                        },
                    })
                        .then(response => {
                            // Get newly created wishlist id and save to store
                            this.setWishlistId(response.data.item.id);

                            this.saveToStore();
                        })
                        .catch(response => {
                            // TODO: add catch clause implementation
                        });

                    // if double addressbook mode is true store address separately
                    // but not for SW API because the billing address is already set in register action
                    if (this.alternativeShippingAddress && !process.env.API_TYPE === 'sw') {
                        // Store Address
                        this.storeCustomerAddress(this.form.addresses[0])
                            .then(() => {
                                // Store different shipping address
                                if (this.differentShippingAddress) {
                                    this.storeCustomerAddress(this.form.addresses[1])
                                        .then(() => {
                                            this.redirectToCheckout();
                                        })
                                        .catch(error => {
                                            // Show api request error
                                            this.addBackendErrors(error.errors);
                                            this.error = error.message;

                                            this.processingRegister = false;
                                        });
                                } else {
                                    this.redirectToCheckout();
                                }
                            })
                            .catch(error => {
                                // Show api request error
                                this.addBackendErrors(error.errors);
                                this.error = error.message;

                                this.processingRegister = false;
                            });
                    } else {
                        this.redirectToCheckout();
                    }
                })
                .catch(error => {
                    // Show api request error
                    this.addBackendErrors(error.errors);
                    this.error = error.message;

                    this.processingRegister = false;
                });
        },
        submitRegisterGuestForm: function () {
            this.processingRegister = true;

            // Set first address to shipping address to false
            if (this.differentShippingAddress) {
                this.form.addresses[0].is_shipping = false;
            }

            // If billing the same as shipping set billing as shipping and edit types
            if (!this.differentShippingAddress) {
                this.setShippingAsBilling();
            }

            // Clear error messages
            this.error = null;

            this.form.baseData.firstname = this.form.addresses[0].payload.firstName;
            this.form.baseData.lastname = this.form.addresses[0].payload.lastName;

            // Post request with login credentials
            this.registerGuest(this.form)
                .then(() => {
                    // If current route is checkout, then do redirect to checkout
                    if (this.$router.history.current.path.includes('/checkout')) {
                        this.$router.push(
                            {
                                path: this.localePath('checkout-payment'),
                            },
                            () => {
                                this.processingRegister = false;
                            }
                        );
                    }
                })
                .catch(error => {
                    // Show api request error
                    this.error = this.$t('Register failed');

                    this.processingRegister = false;
                });
        },
        setShippingAsBilling: function () {
            this.form.addresses[1] = _.cloneDeep(this.form.addresses[0]);
            //this.form.addresses[1].id = 2;
            this.form.addresses[1].is_billing = false;
            this.form.addresses[1].is_billing_default = false;

            this.form.addresses[0].is_shipping = false;
            this.form.addresses[0].is_shipping_default = false;
        },
        redirectToCheckout: function () {
            // If current route is checkout, then do redirect to checkout
            if (this.$router.history.current.path.includes('/checkout')) {
                if (process.env.API_TYPE === 'sw') {
                    this.$router.push(
                        {
                            path: this.localePath('checkout-shopware-onepage'),
                        },
                        () => {
                            this.processingRegister = false;
                        }
                    );
                } else {
                    this.$router.push(
                        {
                            path: this.localePath('checkout-payment'),
                        },
                        () => {
                            this.processingRegister = false;
                        }
                    );
                }
            }

            if (this.$router.history.current.path.includes('/customer')) {
                this.$router.push(
                    {
                        path: this.localePath('customer-dashboard'),
                    },
                    () => {
                        this.processingRegister = false;
                    }
                );
            }
        },
        onPaste: function (e) {
            e.preventDefault();
        },
    },
};
</script>
