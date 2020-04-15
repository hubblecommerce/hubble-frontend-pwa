<template>
    <div class="customer-addresses-wrp">
        <div v-if="loading" class="loader-wrp">
            <div class="loader lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
            </div>
        </div>

        <div v-if="!loading && billingAddresses.length > 0" class="billing-addresses-wrp">
            <div v-if="alternativeShippingAddress" class="headline headline-3" v-text="$t('Billing Address')" />

            <div v-else class="headline headline-3" v-text="$t('Address')" />

            <div v-for="address in billingAddresses" :key="address.id" class="billing-address-wrp">
                <div>
                    <span v-text="mapKeyToValue(address.payload.gender, salutations)" />
                    <span v-text="address.payload.firstName" />
                    <span v-text="address.payload.lastName" />
                </div>
                <div>
                    <span v-text="address.payload.street" />
                    <span v-text="address.payload.houseNo" />
                </div>
                <div>
                    <span v-text="address.payload.postal" />
                    <span v-text="address.payload.city" />
                </div>
                <div>
                    <span v-text="mapIsoToCountry(address.payload.country, countries)" />
                </div>
                <!-- TODO: Implement edit address when SW provides it -->
                <div v-if="!isShopware" class="link text-small edit-address" @click="updateAddress(address)" v-text="$t('Edit address')" />
            </div>
            <div class="button-wrapper">
                <button
                    v-if="!isGuest && addresses.billing.length > 0"
                    class="button-primary mb-1 w-100"
                    @click="selectDefaultAddress('billing')"
                    v-text="$t('Select new default address')"
                />
                <button v-if="!isGuest" class="button-secondary w-100" @click="createAddress('billing')" v-text="$t('Create new address')" />
            </div>
        </div>

        <div v-if="alternativeShippingAddress && !loading && shippingAddresses.length > 0" class="shipping-addresses-wrp">
            <div class="headline headline-3" v-text="$t('Shipping Address')" />

            <div v-for="address in shippingAddresses" :key="address.id" class="shipping-address-wrp">
                <div>
                    <span v-text="mapKeyToValue(address.payload.gender, salutations)" />
                    <span v-text="address.payload.firstName" />
                    <span v-text="address.payload.lastName" />
                </div>
                <div>
                    <span v-text="address.payload.street" />
                    <span v-text="address.payload.houseNo" />
                </div>
                <div>
                    <span v-text="address.payload.postal" />
                    <span v-text="address.payload.city" />
                </div>
                <div>
                    <span v-text="mapIsoToCountry(address.payload.country, countries)" />
                </div>
                <!-- TODO: Implement edit address when SW provides it -->
                <div
                    v-if="!isShopware"
                    class="link text-small edit-address"
                    @click="updateAddress(defaultShippingAddress)"
                    v-text="$t('Edit address')"
                />
            </div>
            <div class="button-wrapper">
                <button
                    v-if="!isGuest && addresses.shipping.length > 0"
                    class="button-primary mb-1 w-100"
                    @click="selectDefaultAddress('shipping')"
                    v-text="$t('Select new default address')"
                />
                <button v-if="!isGuest" class="button-secondary w-100" @click="createAddress('shipping')" v-text="$t('Create new address')" />
            </div>
        </div>

        <transition-expand-layer :right-left="true">
            <div v-if="showLayer" class="transition-expand-wrp">
                <div class="container expand-content">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-close" aria-hidden="true" />
                            <material-ripple />
                        </button>
                        <div v-if="formIsActiveAddressUpdate" class="overlay-headline" v-text="$t('Edit address')" />
                        <div v-if="formIsActiveAddressCreate" class="overlay-headline" v-text="$t('Create new address')" />
                        <div v-if="formIsActiveAddressSelectDefault" class="overlay-headline" v-text="$t('Select new default address')" />
                    </div>
                    <div v-if="!formIsActiveAddressSelectDefault">
                        <div class="row content-wrp">
                            <div class="col-12">
                                <div v-if="formIsActiveAddressUpdate" class="hbl-checkbox save-address-checkbox">
                                    <input id="save-address" v-model="saveAsNewAddress" type="checkbox" />

                                    <label for="save-address">
                                        <span class="name" v-text="$t('Store as new address')" />
                                    </label>
                                </div>

                                <validation-observer
                                    ref="observer"
                                    v-slot="{ passes }"
                                    tag="form"
                                    class="form-edit"
                                    @submit.prevent="passes(submitUpdateForm)"
                                >
                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="gender"
                                        rules="required"
                                        mode="passive"
                                        tag="div"
                                        class="hbl-select"
                                    >
                                        <select v-model="address.payload.gender" class="select-text" required>
                                            <option
                                                v-for="salutation in salutations"
                                                :key="salutation.key"
                                                :value="salutation.key"
                                                :class="{ invalid: errors.length > 0 }"
                                            >
                                                {{ salutation.value }}
                                            </option>
                                        </select>

                                        <label class="select-label" v-text="$t('Salutation') + '*'" />

                                        <div class="validation-msg" v-text="$t(errors[0])" />
                                    </validation-provider>

                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="firstName"
                                        rules="required|max:30"
                                        mode="passive"
                                        tag="div"
                                        class="hbl-input-group"
                                    >
                                        <input
                                            id="firstName"
                                            v-model="address.payload.firstName"
                                            type="text"
                                            name="firstName"
                                            value=""
                                            :class="{ invalid: errors.length > 0 }"
                                            placeholder=" "
                                            required
                                        >

                                        <label for="firstName" v-text="$t('First Name') + '*'" />

                                        <div class="validation-msg" v-text="$t(errors[0])" />
                                    </validation-provider>

                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="lastName"
                                        rules="required|max:30"
                                        mode="passive"
                                        tag="div"
                                        class="hbl-input-group"
                                    >
                                        <input
                                            id="lastName"
                                            v-model="address.payload.lastName"
                                            type="text"
                                            name="lastName"
                                            value=""
                                            :class="{ invalid: errors.length > 0 }"
                                            placeholder=" "
                                            required
                                        >

                                        <label for="lastName" v-text="$t('Last Name') + '*'" />

                                        <div class="validation-msg" v-text="$t(errors[0])" />
                                    </validation-provider>

                                    <template v-if="streetIncludesHouseNo">
                                        <validation-provider
                                            v-slot="{ errors }"
                                            name="street"
                                            rules="required|max:60"
                                            mode="passive"
                                            tag="div"
                                            class="hbl-input-group"
                                        >
                                            <input
                                                id="street"
                                                v-model="address.payload.street"
                                                type="text"
                                                name="street"
                                                value=""
                                                :class="{ invalid: errors.length > 0 }"
                                                placeholder=" "
                                                required
                                            >

                                            <label for="street" v-text="$t('Street') + '/' + $t('Houseno.') + '*'" />

                                            <div class="validation-msg" v-text="$t(errors[0])" />
                                        </validation-provider>
                                    </template>

                                    <div v-else class="form-row street-nr">
                                        <validation-provider
                                            v-slot="{ errors }"
                                            name="street"
                                            rules="required|max:60"
                                            mode="passive"
                                            tag="div"
                                            class="hbl-input-group"
                                        >
                                            <input
                                                id="street"
                                                v-model="address.payload.street"
                                                type="text"
                                                name="street"
                                                value=""
                                                :class="{ invalid: errors.length > 0 }"
                                                placeholder=" "
                                                required
                                            >

                                            <label for="street" v-text="$t('Street') + '*'" />

                                            <div class="validation-msg" v-text="$t(errors[0])" />
                                        </validation-provider>

                                        <validation-provider
                                            v-slot="{ errors }"
                                            name="houseNo"
                                            rules="required|max:5"
                                            mode="passive"
                                            tag="div"
                                            class="hbl-input-group"
                                        >
                                            <input
                                                id="houseNr"
                                                v-model="address.payload.houseNo"
                                                type="text"
                                                name="houseNr"
                                                value=""
                                                :class="{ invalid: errors.length > 0 }"
                                                placeholder=" "
                                                required
                                            >

                                            <label for="houseNr" v-text="$t('Houseno.') + '*'" />

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
                                                id="zipCode"
                                                v-model="address.payload.postal"
                                                type="text"
                                                name="zipCode"
                                                value=""
                                                :class="{ invalid: errors.length > 0 }"
                                                placeholder=" "
                                                required
                                            >

                                            <label for="zipCode" v-text="$t('Zipcode') + '*'" />

                                            <div class="validation-msg" v-text="$t(errors[0])" />
                                        </validation-provider>

                                        <validation-provider
                                            v-slot="{ errors }"
                                            name="city"
                                            rules="required|max:30"
                                            mode="passive"
                                            tag="div"
                                            class="hbl-input-group"
                                        >
                                            <input
                                                id="city"
                                                v-model="address.payload.city"
                                                type="text"
                                                name="city"
                                                value=""
                                                :class="{ invalid: errors.length > 0 }"
                                                placeholder=" "
                                                required
                                            >

                                            <label for="city" v-text="$t('City') + '*'" />

                                            <div class="validation-msg" v-text="$t(errors[0])" />
                                        </validation-provider>
                                    </div>

                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="country"
                                        rules="required"
                                        mode="passive"
                                        tag="div"
                                        class="hbl-select"
                                    >
                                        <select
                                            v-model="address.payload.country"
                                            class="select-text"
                                            :class="{ invalid: errors.length > 0 }"
                                            required
                                        >
                                            <option v-for="country in countries" :key="country.iso_code_2" :value="country.iso_code_2">{{
                                                country.name
                                            }}</option>
                                        </select>

                                        <label class="select-label" v-text="$t('Country') + '*'" />

                                        <div class="validation-msg" v-text="$t(errors[0])" />
                                    </validation-provider>

                                    <div class="error-message" v-text="error" />

                                    <button
                                        v-if="formIsActiveAddressUpdate && !saveAsNewAddress"
                                        class="button-primary"
                                        @click.prevent="passes(submitUpdateForm)"
                                    >
                                        {{ $t('Edit') }}
                                        <material-ripple />
                                    </button>

                                    <button
                                        v-if="formIsActiveAddressCreate || saveAsNewAddress"
                                        class="button-primary"
                                        @click.prevent="passes(submitCreateForm)"
                                    >
                                        {{ $t('Add') }}
                                        <material-ripple />
                                    </button>
                                </validation-observer>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="formIsActiveAddressSelectDefault">
                        <div class="row content-wrp">
                            <div class="col-12">
                                <div class="selectable-address-wrp">
                                    <div
                                        class="selectable-address selectable-default-address"
                                        :class="isSelectedAsDefault(currentDefaultAddress)"
                                        @click.prevent="selectDefault(currentDefaultAddress)"
                                    >
                                        <div>
                                            <span v-text="mapKeyToValue(currentDefaultAddress.payload.gender, salutations)" />
                                            <span v-text="currentDefaultAddress.payload.firstName" />
                                            <span v-text="currentDefaultAddress.payload.lastName" />
                                        </div>

                                        <div>
                                            <span v-text="currentDefaultAddress.payload.street" />
                                            <span v-text="currentDefaultAddress.payload.houseNo" />
                                        </div>

                                        <div>
                                            <span v-text="currentDefaultAddress.payload.postal" />
                                            <span v-text="currentDefaultAddress.payload.city" />
                                        </div>

                                        <div>
                                            <span v-text="mapIsoToCountry(currentDefaultAddress.payload.country, countries)" />
                                        </div>
                                    </div>
                                    <div
                                        v-for="address in possibleDefaultAddresses"
                                        :key="address.id"
                                        class="selectable-address"
                                        :class="isSelectedAsDefault(address)"
                                    >
                                        <div class="selectable-default-address" @click.prevent="selectDefault(address)">
                                            <div>
                                                <span v-text="mapKeyToValue(address.payload.gender, salutations)" />
                                                <span v-text="address.payload.firstName" />
                                                <span v-text="address.payload.lastName" />
                                            </div>

                                            <div>
                                                <span v-text="address.payload.street" />
                                                <span v-text="address.payload.houseNo" />
                                            </div>

                                            <div>
                                                <span v-text="address.payload.postal" />
                                                <span v-text="address.payload.city" />
                                            </div>

                                            <div>
                                                <span v-text="mapIsoToCountry(address.payload.country, countries)" />
                                            </div>
                                        </div>
                                        <div v-if="showDeleteIcon(address)" class="delete-icon-wrp" @click.prevent="selectDelete(address)">
                                            <button class="button-icon">
                                                <i class="icon" :class="isSelectedForDeletion(address)" aria-hidden="true" />

                                                <span class="hidden-link-name">Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="actions">
                                    <div class="error-message" v-text="error" />

                                    <button
                                        v-if="!selectedDelete.length > 0"
                                        class="button-primary"
                                        :class="isNewDefaultAddress()"
                                        @click.prevent="submitNewDefault()"
                                    >
                                        {{ $t('Select as default address') }}
                                        <material-ripple />
                                    </button>

                                    <button v-else class="button-primary delete-address-button" @click.prevent="submitDeleteAddress()">
                                        {{ $t('Delete selected addresses') }}
                                        <material-ripple />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Form from '@hubblecommerce/hubble/core/utils/form';
import { mapKeyToValue, mapIsoToCountry, addBackendErrors, salutations } from '@hubblecommerce/hubble/core/utils/formMixins';

export default {
    name: 'CustomerAddresses',

    mixins: [mapKeyToValue, mapIsoToCountry, addBackendErrors, salutations],

    props: {
        showAllAddresses: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data() {
        return {
            name: 'CustomerAddresses',

            streetIncludesHouseNo: process.env.STREETINFO_INCLUDES_HOUSENO === 'true',
            alternativeShippingAddress: process.env.ALTERNATIVE_SHIPPING_ADDRESS === 'true',
            isShopware: process.env.API_TYPE === 'sw',

            addresses: {
                billing: [],
                shipping: [],
            },
            loading: false,
            address: new Form({}),

            defaultBillingAddress: null,
            defaultShippingAddress: null,

            selectedDefault: null,
            selectedDelete: [],

            saveAsNewAddress: false,

            error: null,

            addressTemplate: new Form({
                is_billing: false,
                is_billing_default: false,
                is_shipping: false,
                is_shipping_default: false,
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
            }),
            formIsActiveAddressCreate: false,
            formIsActiveAddressUpdate: false,
            formIsActiveAddressSelectDefault: false,
        };
    },

    computed: {
        ...mapState({
            customer: state => state.modApiCustomer.customer,
            countries: state => state.modApiCustomer.availableCountries,
            offcanvas: state => state.modNavigation.offcanvas,
        }),
        showLayer: function () {
            return this.offcanvas.component === this.name;
        },
        isGuest: function () {
            return this.customer.customerAuth.token === 'guest';
        },
        currentDefaultAddress: function () {
            if (this.address.is_billing) {
                return this.defaultBillingAddress;
            }
            if (this.address.is_shipping) {
                return this.defaultShippingAddress;
            }
            return this.defaultBillingAddress;
        },
        possibleDefaultAddresses: function () {
            if (this.address.is_billing) {
                return this.addresses.billing;
            }
            if (this.address.is_shipping) {
                return this.addresses.shipping;
            }
            return this.addresses.billing;
        },
        billingAddresses: function () {
            let addresses = [];
            if (this.defaultBillingAddress !== null) {
                addresses.push(this.defaultBillingAddress);
            }
            if (this.showAllAddresses) {
                addresses = _.concat(addresses, this.addresses.billing);
            }
            return addresses;
        },
        shippingAddresses: function () {
            let addresses = [];
            if (this.defaultShippingAddress !== null) {
                addresses.push(this.defaultShippingAddress);
            }
            if (this.showAllAddresses) {
                addresses = _.concat(addresses, this.addresses.shipping);
            }
            return addresses;
        },
    },

    watch: {
        selectedDelete: function () {
            if (!_.isEmpty(this.selectedDelete)) {
                this.selectedDefault = this.currentDefaultAddress;
            }
        },
        defaultShippingAddress: function () {
            // recalculate shipping cost when shipping address changes
            this.calculateShippingCosts(this.defaultShippingAddress.country)
                .then(response => {
                    //console.log(response);
                })
                .catch(error => {
                    //console.log('Calculated Shipping costs failed: ', error);
                });
        },
    },

    mounted() {
        if (_.isEmpty(this.countries)) {
            this.getAvailableCountries();
        }
        this.getAddresses();
    },

    methods: {
        ...mapActions({
            getAvailableCountries: 'modApiCustomer/getAvailableCountries',
            getCustomerAddresses: 'modApiCustomer/getCustomerAddresses',
            storeCustomerAddress: 'modApiCustomer/storeCustomerAddress',
            editAddress: 'modApiCustomer/editAddress',
            deleteCustomerAddress: 'modApiCustomer/deleteCustomerAddress',
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
            editGuestAddress: 'modApiCustomer/editGuestAddress',
            calculateShippingCosts: 'modCart/calculateShippingCosts',
        }),
        toggle: function () {
            return new Promise(resolve => {
                this.toggleOffcanvasAction({
                    component: this.name,
                    direction: 'rightLeft',
                }).then(() => {
                    // reset ...
                    if (!this.showLayer) {
                        this.formIsActiveAddressCreate = false;
                        this.formIsActiveAddressUpdate = false;
                        this.formIsActiveAddressSelectDefault = false;

                        this.saveAsNewAddress = false;

                        this.address = new Form();
                    }

                    //reset error message
                    this.error = '';
                    resolve('OffCanvas toggled.');
                });
            });
        },
        hide: function () {
            this.hideOffcanvasAction();
        },
        getAddresses: function () {
            this.loading = true;
            // Get addresses from store if guest
            if (this.isGuest) {
                this.mapAddresses();

                this.loading = false;
            } else {
                // Get addresses from api if logged in user
                this.getCustomerAddresses()
                    .then(() => {
                        this.mapAddresses();

                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            }
        },
        mapAddresses: function () {
            this.addresses = {
                billing: [],
                shipping: [],
            };
            _.forEach(this.customer.customerAddresses, val => {
                if (val.is_billing) {
                    if (val.is_billing_default) {
                        this.defaultBillingAddress = val;
                    } else {
                        this.addresses.billing.push(val);
                    }
                }
                if (val.is_shipping) {
                    if (val.is_shipping_default) {
                        this.defaultShippingAddress = val;
                    } else {
                        this.addresses.shipping.push(val);
                    }
                }
            });
        },
        createAddress: function (addressType) {
            this.formIsActiveAddressCreate = true;
            this.formIsActiveAddressSelectDefault = false;
            this.formIsActiveAddressUpdate = false;

            // Clone empty address template
            let clone = _.cloneDeep(this.addressTemplate);

            // Init new form object
            this.address = new Form(clone);

            // Set type of address
            if (addressType === 'billing') {
                this.address.is_billing = true;
                this.address.is_billing_default = true;
            }

            if (addressType === 'shipping') {
                this.address.is_shipping = true;
                this.address.is_shipping_default = true;
            }

            this.toggle();
        },
        updateAddress: function (address) {
            this.formIsActiveAddressCreate = false;
            this.formIsActiveAddressSelectDefault = false;
            this.formIsActiveAddressUpdate = true;

            // Clone object to avoid editing vuex state directly
            let clone = _.cloneDeep(address);

            // Init new form object
            this.address = new Form(clone);

            this.toggle();
        },
        selectDefaultAddress: function (addressType) {
            this.formIsActiveAddressCreate = false;
            this.formIsActiveAddressSelectDefault = true;
            this.formIsActiveAddressUpdate = false;

            // Clone empty address template
            let clone = _.cloneDeep(this.addressTemplate);

            // Init new form object
            this.address = new Form(clone);

            // Clear selectedDelete
            this.selectedDelete = [];

            // Set type of address
            if (addressType === 'billing') {
                this.address.is_billing = true;

                // Set SelectedDefault
                this.selectedDefault = this.defaultBillingAddress;
            }

            if (addressType === 'shipping') {
                this.address.is_shipping = true;

                // Set SelectedDefault
                this.selectedDefault = this.defaultShippingAddress;
            }

            this.toggle();
        },
        submitCreateForm: function () {
            let address = this.address.getPayloadData();

            // remove house number from payload object if street includes it
            if (this.streetIncludesHouseNo) {
                address.payload = _.omit(address.payload, 'houseNo');
            }

            this.storeCustomerAddress(address)
                .then(() => {
                    // Refresh addresses and close offcanvas
                    this.getAddresses();

                    this.toggle();
                })
                .catch(error => {
                    // Show api request error
                    this.addBackendErrors(error.errors);

                    this.error = error.message;
                    //this.error = this.$t('Store new address failed');
                });
        },
        submitUpdateForm: function () {
            let address = this.address.getPayloadData();

            // remove house number from payload object if street includes it
            if (this.streetIncludesHouseNo) {
                address = _.omit(address, 'houseNo');
            }

            // Do API call if is logged in user
            if (!this.isGuest) {
                // dispatch data to api ...
                this.editAddress(address)
                    .then(() => {
                        // Refresh addresses and close offcanvas
                        this.getAddresses();

                        this.toggle();
                    })
                    .catch(error => {
                        // Show api request error
                        this.addBackendErrors(error.errors);

                        this.error = error.message;
                        //this.error = this.$t('Editing address failed');
                    });
            } else {
                // Edit cookie if is guest
                // dispatch data to api ...
                this.editGuestAddress(address)
                    .then(() => {
                        this.getAddresses();

                        this.toggle();
                    })
                    .catch(() => {
                        // Show api request error
                        this.error = this.$t('Editing address failed');
                    });
            }
        },
        submitNewDefault: function () {
            if (this.address.is_billing) {
                if (this.selectedDefault === this.defaultBillingAddress) {
                    this.toggle();
                } else {
                    let newDefaultAddress = _.cloneDeep(this.selectedDefault);
                    newDefaultAddress.is_billing_default = true;

                    // remove house number from payload object if street includes it
                    if (this.streetIncludesHouseNo) {
                        newDefaultAddress = _.omit(newDefaultAddress, 'houseNo');
                    }

                    this.editAddress(newDefaultAddress)
                        .then(() => {
                            this.getAddresses();

                            this.toggle();
                        })
                        .catch(error => {
                            console.log(error);
                            // Show api request error
                            this.error = this.$t('Select new billing address failed');
                        });
                }
            }
            if (this.address.is_shipping) {
                if (this.selectedDefault === this.defaultShippingAddress) {
                    this.toggle();
                } else {
                    let newDefaultAddress = _.cloneDeep(this.selectedDefault);
                    newDefaultAddress.is_shipping_default = true;

                    // remove house number from payload object if street includes it
                    if (this.streetIncludesHouseNo) {
                        newDefaultAddress = _.omit(newDefaultAddress, 'houseNo');
                    }

                    this.editAddress(newDefaultAddress)
                        .then(() => {
                            this.getAddresses();
                            this.toggle();
                        })
                        .catch(error => {
                            console.log(error);
                            // Show api request error
                            this.error = this.$t('Select new shipping address failed');
                        });
                }
            }
        },
        submitDeleteAddress: function () {
            // dispatch delete calls to api..
            _.forEach(this.selectedDelete, address => {
                this.deleteCustomerAddress(address)
                    .then(() => {
                        this.getAddresses();
                    })
                    .catch(() => {
                        // Show api request error
                        this.error = this.$t('Delete address failed');
                    });
            });

            this.selectedDelete = [];
        },
        selectDefault: function (address) {
            if (this.selectedDelete.length > 0) return;
            this.selectedDefault = address;
        },
        selectDelete(address) {
            if (!_.includes(this.selectedDelete, address)) {
                this.selectedDelete.push(address);
            } else {
                this.selectedDelete = _.without(this.selectedDelete, address);
            }
        },
        showDeleteIcon: function (address) {
            return !(address.is_billing_default || address.is_shipping_default);
        },
        // Methods for selecting classes
        isSelectedForDeletion: function (address) {
            return {
                'icon-trash': !_.includes(this.selectedDelete, address),
                'icon-trash-2': _.includes(this.selectedDelete, address),
            };
        },
        isNewDefaultAddress: function () {
            return {
                'select-address-button': true,
                'select-address-button-success': !_.isEqual(this.selectedDefault.id, this.currentDefaultAddress.id),
            };
        },
        isSelectedAsDefault: function (address) {
            return {
                'selected-address': _.isEqual(this.selectedDefault.id, address.id),
            };
        },
    },
};
</script>
