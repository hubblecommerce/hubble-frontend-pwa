<template>
    <div class="new-customer-addresses-wrp">
        <template>
            <div v-if="differentShippingAddress" class="d-flex justify-content-between">
                <div class="headline headline-3" v-text="$t('Billing Address')" />
                <div class="link text-small" @click="createAddress('billing')" v-text="$t('Create new address')" />
            </div>
            <div v-else class="d-flex justify-content-between">
                <div class="headline headline-3" v-text="$t('Your Address')" />
                <div
                    class="link text-small"
                    @click="createAddress('shipping')"
                    v-text="$t('Abweichende Lieferadresse hinzufügen')"
                />
            </div>
            <div class="billing-address-wrp">
                <div>
                    <!--                    <span v-text="mapKeyToValue(activeBillingAddress.gender, salutations)" />-->
                    <span v-text="activeBillingAddress.firstName" />
                    <span v-text="activeBillingAddress.lastName" />
                </div>
                <div>
                    <span v-text="activeBillingAddress.street" />
                    <span v-text="activeBillingAddress.houseNo" />
                </div>
                <div>
                    <span v-text="activeBillingAddress.postal" />
                    <span v-text="activeBillingAddress.city" />
                </div>
                <!--                <div>
                    <span v-text="mapIsoToCountry(activeBillingAddress.country, countries)" />
                </div>-->
                <div
                    class="link text-small edit-address"
                    @click="updateAddress(activeBillingAddress, 'billing')"
                    v-text="$t('Edit')"
                />
            </div>

            <template v-if="differentShippingAddress">
                <div class="d-flex justify-content-between mt-4">
                    <div class="headline headline-3" v-text="$t('Shipping Address')" />
                    <div class="link text-small" @click="createAddress('shipping')" v-text="$t('Create new address')" />
                </div>
                <div class="shipping-address-wrp">
                    <div>
                        <!--                    <span v-text="mapKeyToValue(activeShippingAddress.gender, salutations)" />-->
                        <span v-text="activeShippingAddress.firstName" />
                        <span v-text="activeShippingAddress.lastName" />
                    </div>
                    <div>
                        <span v-text="activeShippingAddress.street" />
                        <span v-text="activeShippingAddress.houseNo" />
                    </div>
                    <div>
                        <span v-text="activeShippingAddress.postal" />
                        <span v-text="activeShippingAddress.city" />
                    </div>
                    <!--                <div>
                                        <span v-text="mapIsoToCountry(activeShippingAddress.country, countries)" />
                                    </div>-->
                    <div
                        class="link text-small edit-address"
                        @click="updateAddress(activeShippingAddress, 'shipping')"
                        v-text="$t('Edit')"
                    />
                </div>
            </template>

            <div v-if="modalOpen" class="edit-address-modal">
                <div class="edit-address-wrp" v-click-outside="closeModal">
                    <div class="modal-headline d-flex justify-content-between">
                        <div class="font-weight-bold" v-text="modalTitle" />
                        <button class="button-icon button-close-modal" @click="closeModal">
                            <i class="icon icon-x" aria-hidden="true" />
                            <material-ripple />
                        </button>
                    </div>
                    <form class="form-edit">
                        <div class="hbl-select">
                            <select v-model="address.gender" class="select-text" required>
                                <option v-for="salutation in salutations" :key="salutation.key" :value="salutation.key">
                                    {{ salutation.value }}
                                </option>
                            </select>

                            <label class="select-label" v-text="$t('Salutation') + '*'" />
                        </div>

                        <div class="hbl-input-group">
                            <input
                                id="firstName"
                                v-model="address.firstName"
                                type="text"
                                name="firstName"
                                value=""
                                placeholder=" "
                                required
                            />

                            <label for="firstName" v-text="$t('First Name') + '*'" />
                        </div>

                        <div class="hbl-input-group">
                            <input
                                id="lastName"
                                v-model="address.lastName"
                                type="text"
                                name="lastName"
                                value=""
                                placeholder=" "
                                required
                            />

                            <label for="lastName" v-text="$t('Last Name') + '*'" />
                        </div>

                        <template v-if="streetIncludesHouseNo">
                            <div class="hbl-input-group">
                                <input
                                    id="street"
                                    v-model="address.street"
                                    type="text"
                                    name="street"
                                    value=""
                                    placeholder=" "
                                    required
                                />

                                <label for="street" v-text="$t('Street') + '/' + $t('Houseno.') + '*'" />
                            </div>
                        </template>

                        <div v-else class="form-row street-nr">
                            <div class="hbl-input-group">
                                <input
                                    id="street"
                                    v-model="address.street"
                                    type="text"
                                    name="street"
                                    value=""
                                    placeholder=" "
                                    required
                                />

                                <label for="street" v-text="$t('Street') + '*'" />
                            </div>

                            <div class="hbl-input-group">
                                <input
                                    id="houseNr"
                                    v-model="address.houseNo"
                                    type="text"
                                    name="houseNr"
                                    value=""
                                    placeholder=" "
                                    required
                                />

                                <label for="houseNr" v-text="$t('Houseno.') + '*'" />
                            </div>
                        </div>

                        <div class="form-row zip-city">
                            <div class="hbl-input-group">
                                <input
                                    id="zipCode"
                                    v-model="address.postal"
                                    type="text"
                                    name="zipCode"
                                    value=""
                                    placeholder=" "
                                    required
                                />

                                <label for="zipCode" v-text="$t('Zipcode') + '*'" />
                            </div>

                            <div class="hbl-input-group">
                                <input
                                    id="city"
                                    v-model="address.city"
                                    type="text"
                                    name="city"
                                    value=""
                                    placeholder=" "
                                    required
                                />

                                <label for="city" v-text="$t('City') + '*'" />
                            </div>

                            <div class="hbl-select">
                                <select v-model="address.country" class="select-text" required>
                                    <option
                                        v-for="country in countries"
                                        :key="country.iso_code_2"
                                        :value="country.iso_code_2"
                                        >{{ country.name }}</option
                                    >
                                </select>

                                <label class="select-label" v-text="$t('Country') + '*'" />
                            </div>
                        </div>
                        <button class="button-primary w-100" @click.prevent="submitForm">
                            {{ $t('Save') }}
                            <material-ripple />
                        </button>
                    </form>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
import Vue from 'vue';
import vClickOutside from 'v-click-outside';
import { salutations } from '@hubblecommerce/hubble/core/utils/formMixins';
export default {
    name: 'NewCustomerAddresses',
    mixins: [salutations],
    data() {
        return {
            name: 'CustomerAddresses',

            streetIncludesHouseNo: process.env.STREETINFO_INCLUDES_HOUSENO === 'true',
            alternativeShippingAddress: process.env.ALTERNATIVE_SHIPPING_ADDRESS === 'true',

            address: {},
            modalOpen: false,
            actionType: '',
            contextType: '',
        };
    },
    computed: {
        ...mapState({
            customer: (state) => state.modApiCustomer.customer,
            countries: (state) => state.modApiCustomer.availableCountries,
            activeBillingAddress: (state) => state.modApiCustomer.customer.customerData.activeBillingAddress,
            activeShippingAddress: (state) => state.modApiCustomer.customer.customerData.activeShippingAddress,
        }),
        differentShippingAddress: function () {
            return this.activeBillingAddress.id !== this.activeShippingAddress.id;
        },
        modalTitle: function () {
            if (this.type === 'shipping') {
                return 'Add shipping address';
            }

            return 'Add billing address';
        },
        isGuest: function () {
            if (!_.isEmpty(this.customer.customerAuth)) {
                return this.customer.customerAuth.guest;
            }

            return false;
        },
    },
    created() {
        Vue.use(vClickOutside);
    },

    mounted() {
        if (_.isEmpty(this.countries)) {
            this.getAvailableCountries();
        }
    },
    methods: {
        ...mapActions({
            getAvailableCountries: 'modApiCustomer/getAvailableCountries',
            updateAddressAction: 'modApiCustomer/editAddress',
            setActiveAddress: 'modApiCustomer/setActiveAddress',
            storeCustomerAddress: 'modApiCustomer/storeCustomerAddress',
            getCustomerAddresses: 'modApiCustomer/getCustomerAddresses',
        }),
        updateAddress(address, type) {
            this.address = _.cloneDeep(address);
            this.actionType = 'update';
            this.contextType = type;
            this.modalOpen = true;
        },
        createAddress(type) {
            this.actionType = 'create';
            this.contextType = type;
            this.modalOpen = true;
        },
        async selectAddess(type) {
            this.actionType = 'select';
            this.contextType = type;
            this.modalOpen = true;
        },
        closeModal() {
            this.address = {};
            this.actionType = '';
            this.modalOpen = false;
        },
        async submitForm() {
            try {
                let addressId;

                if (this.actionType === 'update') {
                    let response = await this.updateAddressAction(this.address);
                    addressId = response.data.id;
                }
                if (this.actionType === 'create') {
                    let response = await this.storeCustomerAddress(this.address);
                    addressId = response.data.id;
                }
                if (this.actionType === 'select') {
                    // todo: select modal and current address in data property address
                    addressId = this.address.id;
                }

                let payload = {};
                if (this.contextType === 'billing') {
                    payload.billingAddressId = addressId;
                }

                if (this.contextType === 'shipping') {
                    payload.shippingAddressId = addressId;
                }

                await this.setActiveAddress(payload);
                this.closeModal();
            } catch (e) {
                //console.log(e)
            }
        },
    },
};
</script>

<style scoped></style>
