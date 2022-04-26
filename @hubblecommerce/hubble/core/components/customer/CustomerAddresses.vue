<template>
    <div v-if="!isLoading" class="customer-addresses-wrp">
        <div v-if="differentShippingAddress" class="d-flex justify-content-between">
            <div class="headline headline-5" v-text="'Billing Address'" />
            <hbl-button v-if="!isGuest" class="button" @click.native="createAddress('billing')" v-text="'Create new address'" />
        </div>

        <div v-else class="billing-address-actions">
            <div class="headline headline-5" v-text="'Your Address'" />
            <hbl-button class="btn-address-create" @click.native="createAddress('shipping')" v-text="'Add different shipping address'" />
        </div>

        <div class="billing-address-wrp">
            <div>
                <span v-text="activeBillingAddress.company" />
            </div>
            <div>
                <span v-text="getSalutationById(activeBillingAddress.salutationId)" />
                <span v-text="activeBillingAddress.firstName" />
                <span v-text="activeBillingAddress.lastName" />
            </div>
            <div>
                <span v-text="activeBillingAddress.street" />
            </div>
            <div>
                <span v-text="activeBillingAddress.zipcode" />
                <span v-text="activeBillingAddress.city" />
            </div>
            <div>
                <span v-text="getCountryById(activeBillingAddress.countryId)" />
            </div>
            <hbl-button class="button-link edit-address" @click.native="updateAddress(activeBillingAddress, 'billing')" v-text="'Edit'" />
        </div>

        <template v-if="differentShippingAddress">
            <div class="d-flex justify-content-between mt-4">
                <div class="headline headline-3" v-text="'Shipping Address'" />
                <hbl-button v-if="!isGuest" class="button" @click.native="createAddress('shipping')" v-text="'Create new address'" />
            </div>
            <div class="shipping-address-wrp">
                <div>
                    <span v-text="activeShippingAddress.company" />
                </div>
                <div>
                    <span v-text="getSalutationById(activeShippingAddress.salutationId)" />
                    <span v-text="activeShippingAddress.firstName" />
                    <span v-text="activeShippingAddress.lastName" />
                </div>
                <div>
                    <span v-text="activeShippingAddress.street" />
                </div>
                <div>
                    <span v-text="activeShippingAddress.zipcode" />
                    <span v-text="activeShippingAddress.city" />
                </div>
                <div>
                    <span v-text="getCountryById(activeShippingAddress.countryId)" />
                </div>
                <hbl-button class="button edit-address" @click.native="updateAddress(activeShippingAddress, 'shipping')" v-text="'Edit'" />
            </div>
        </template>

        <div v-if="modalOpen" class="edit-address-modal">
            <div class="edit-address-wrp" v-click-outside="closeModal">
                <div class="modal-headline d-flex justify-content-between">
                    <div class="font-weight-bold" v-text="modalTitle" />
                    <hbl-button class="button-icon button-close-modal" @click.native="closeModal">
                        <svg-icon icon="x" />
                    </hbl-button>
                </div>
                <form class="form-edit" @submit.prevent="submitForm">
                    <hbl-select>
                        <select v-model="address.salutationId" class="select-text" required>
                            <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">
                                {{ salutation.translated.displayName }}
                            </option>
                        </select>
                        <label class="select-label" v-text="'Salutation'" />
                    </hbl-select>

                    <hbl-input>
                        <input id="firstName" v-model="address.firstName" type="text" name="firstName" value="" placeholder=" " required />
                        <label for="firstName" v-text="'First Name'" />
                    </hbl-input>

                    <hbl-input>
                        <input id="lastName" v-model="address.lastName" type="text" name="lastName" value="" placeholder=" " required />
                        <label for="lastName" v-text="'Last Name'" />
                    </hbl-input>

                    <hbl-input>
                        <input id="phoneNumber" v-model="address.phoneNumber" type="text" placeholder=" " autocomplete="phone" />
                        <label for="phoneNumber" v-text="'Phone (optional)'" />
                    </hbl-input>

                    <hbl-input>
                        <input id="company" v-model="address.company" type="text" placeholder=" " autocomplete="company" />
                        <label for="company" v-text="'Company (optional)'" />
                    </hbl-input>

                    <hbl-input>
                        <input id="street" v-model="address.street" type="text" name="street" value="" placeholder=" " required />
                        <label for="street" v-text="'Street'" />
                    </hbl-input>

                    <div class="form-row zip-city">
                        <hbl-input>
                            <input id="zipcode" v-model="address.zipcode" type="text" name="zipcode" value="" placeholder=" " required />
                            <label for="zipcode" v-text="'Zipcode'" />
                        </hbl-input>

                        <hbl-input>
                            <input id="city" v-model="address.city" type="text" name="city" value="" placeholder=" " required />
                            <label for="city" v-text="'City'" />
                        </hbl-input>
                    </div>

                    <hbl-select>
                        <select id="country" v-model="address.countryId" class="select-text" required>
                            <option v-for="country in countries" :key="country.id" :value="country.id" v-text="country.name" />
                        </select>

                        <label for="country" class="select-label" v-text="'Country'" />
                    </hbl-select>

                    <hbl-button class="button-primary w-100" @click.native="submitForm" v-text="'Save'" />
                </form>
            </div>
        </div>
    </div>
    <loader v-else />
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';
import vClickOutside from 'v-click-outside';
import ApiClient from '@/utils/api-client';

export default {
    name: 'CustomerAddresses',

    data() {
        return {
            isLoading: true,
            salutations: [],
            countries: [],
            address: {},
            activeBillingAddress: null,
            activeShippingAddress: null,
            modalOpen: false,
            actionType: '',
            contextType: '',
            context: null,
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
        differentShippingAddress: function () {
            if (this.activeBillingAddress != null && this.activeShippingAddress != null) {
                return this.activeBillingAddress.id !== this.activeShippingAddress.id;
            }
        },
        modalTitle: function () {
            if (this.type === 'shipping') {
                return 'Add shipping address';
            }

            return 'Add billing address';
        },
        isGuest: function () {
            if (this.context.data != null) {
                return this.context.data.customer.guest;
            }

            return null;
        },
    },

    created() {
        Vue.use(vClickOutside);
    },

    async mounted() {
        try {
            let [salutationResponse, countryResponse] = await this.fetchFormOptions();
            this.salutations = salutationResponse.data.elements;
            this.countries = countryResponse.data.elements;

            // Fetch current context (activeBillingAddress and activeShippingAddress)
            this.context = await this.fetchContext();
            if (this.context.data.customer != null) {
                this.activeBillingAddress = this.context.data.customer.activeBillingAddress;
                this.activeShippingAddress = this.context.data.customer.activeShippingAddress;
            }

            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
            throw e;
        }
    },

    methods: {
        ...mapActions({
            updateAddressAction: 'modApiCustomer/editAddress',
            setActiveAddress: 'modApiCustomer/setActiveAddress',
            storeCustomerAddress: 'modApiCustomer/storeCustomerAddress',
        }),
        fetchFormOptions: async function () {
            return await Promise.all([this.fetchSalutations(), this.fetchCountries()]);
        },
        fetchSalutations: async function () {
            return await new ApiClient(this.$config).apiCall({
                action: 'get',
                endpoint: 'store-api/salutation',
            });
        },
        fetchCountries: async function () {
            return await new ApiClient(this.$config).apiCall({
                action: 'post',
                endpoint: 'store-api/country',
                data: {
                    filter: [
                        {
                            type: 'equals',
                            field: 'active',
                            value: true,
                        },
                        {
                            type: 'equals',
                            field: 'shippingAvailable',
                            value: true,
                        },
                    ],
                    sort: [
                        {
                            field: 'position',
                            order: 'ASC',
                        },
                    ],
                },
            });
        },
        fetchContext: async function () {
            return await new ApiClient(this.$config).apiCall({
                action: 'get',
                endpoint: 'store-api/context',
                contextToken: this.contextToken,
            });
        },
        getSalutationById: function (id) {
            let selectFieldName = null;
            this.salutations.forEach((field) => {
                if (field.id === id) {
                    selectFieldName = field.translated.displayName;
                    return selectFieldName;
                }
            });
            return selectFieldName;
        },
        getCountryById: function (id) {
            let selectFieldName = null;
            this.countries.forEach((field) => {
                if (field.id === id) {
                    selectFieldName = field.translated.name;
                    return selectFieldName;
                }
            });
            return selectFieldName;
        },
        updateAddress(address, type) {
            this.address = Object.assign({}, address);
            this.actionType = 'update';
            this.contextType = type;
            this.modalOpen = true;

            if (type == 'billing') {
                this.activeBillingAddress = address;
            } else {
                this.activeShippingAddress = address;
            }
        },
        updateAddressCall: async function (address) {
            return await new ApiClient(this.$config).apiCall({
                action: 'patch',
                endpoint: `store-api/account/address/${address.id}`,
                contextToken: this.contextToken,
                data: address,
            });
        },
        setActiveAddressToContext: async function (payload) {
            return await new ApiClient(this.$config).apiCall({
                action: 'patch',
                endpoint: 'store-api/context',
                contextToken: this.contextToken,
                data: payload,
            });
        },
        createAddress(type) {
            this.actionType = 'create';
            this.contextType = type;
            this.modalOpen = true;
        },
        createAddressCall: async function (address) {
            return await new ApiClient(this.$config).apiCall({
                action: 'post',
                endpoint: 'store-api/account/address',
                contextToken: this.contextToken,
                data: address,
            });
        },
        selectAddess(type) {
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
            this.isLoading = true;

            try {
                let addressId;
                let response;

                if (this.actionType === 'update') {
                    response = await this.updateAddressCall(this.address);
                    addressId = response.data.id;
                }
                if (this.actionType === 'create') {
                    response = await this.createAddressCall(this.address);
                    addressId = response.data.id;
                }
                if (this.actionType === 'select') {
                    // todo: select modal and current address in data property address
                    addressId = this.address.id;
                }

                let payload = {};
                if (this.contextType === 'billing') {
                    payload.billingAddressId = addressId;
                    this.activeBillingAddress = response.data;
                }

                if (this.contextType === 'shipping') {
                    payload.shippingAddressId = addressId;
                    this.activeShippingAddress = response.data;
                }

                // todo: flash message "address was saved/edited/selected"

                await this.setActiveAddressToContext(payload);
                this.closeModal();

                this.isLoading = false;
            } catch (e) {
                console.log(e);
                this.isLoading = false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';

.loader-wrp {
    width: 100%;
    height: 450px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.customer-addresses-wrp {
    margin-bottom: 20px;

    .billing-address-actions {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .btn-address-create {
            padding: 0px;
            color: $blue;
            background: transparent;
            font-size: 14px;
            text-decoration: underline;
            text-transform: none;
            font-weight: normal;
        }
    }

    .billing-address-wrp,
    .shipping-address-wrp {
        border: 1px solid $border-color;
        padding: 20px;
        position: relative;

        margin-bottom: 20px;
    }

    .edit-address-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.5);

        .edit-address-wrp {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            height: 100%;
            background: $white;
            overflow-y: scroll;

            .modal-headline {
                position: relative;
                width: 100%;
                border-bottom: 1px solid $border-color;
                padding: 20px;
                align-items: center;
                text-transform: uppercase;
            }

            .button-close-modal {
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto 0;
            }

            .form-edit {
                padding: 20px;
            }
        }
    }

    .edit-address {
        position: absolute;
        top: 0px;
        right: 0px;
    }

    .link {
        text-decoration: underline;
    }
}

@media (min-width: 1024px) {
    .customer-addresses-wrp {
        .edit-address-modal {
            justify-content: center;

            .edit-address-wrp {
                margin: auto;
                width: auto;
                max-width: 500px;
                height: auto;
                overflow: visible;
            }
        }
    }
}
</style>
