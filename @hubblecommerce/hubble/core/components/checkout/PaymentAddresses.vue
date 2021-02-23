<template>
    <div v-if="!isLoading" class="customer-addresses-wrp">
        <div v-if="differentShippingAddress" class="address-headline">
            <div class="headline headline-3" v-text="'Billing Address'" />
            <div class="text-small link" @click="createAddress('billing')" v-text="'Create new address'" />
        </div>

        <div v-else class="address-headline">
            <div class="headline headline-3" v-text="'Your Address'" />
            <div
                class="text-small link"
                @click="createAddress('shipping')"
                v-text="'Add different shipping address'"
            />
        </div>

        <div class="billing-address-wrp">
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
            <div
                class="text-small link edit-address"
                @click="updateAddress(activeBillingAddress, 'billing')"
                v-text="'Edit'"
            />
            <div
                class="text-small link"
                @click="selectAddress('billing')"
                v-text="'Select a different address'"
            />
        </div>

        <template v-if="differentShippingAddress">
            <div class="address-headline">
                <div class="headline headline-3" v-text="'Shipping Address'" />
                <div class="text-small link" @click="createAddress('shipping')" v-text="'Create new address'" />
            </div>
            <div class="shipping-address-wrp">
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
                <div
                    class="text-small link edit-address"
                    @click="updateAddress(activeShippingAddress, 'shipping')"
                    v-text="'Edit'"
                />
                <div
                    class="text-small link"
                    @click="selectAddress('shipping')"
                    v-text="'Select a different address'"
                />
            </div>
        </template>

        <div v-if="modalOpen" class="edit-address-modal">
            <div class="edit-address-wrp" v-click-outside="closeModal">
                <div class="modal-headline">
                    <div class="font-weight-bold" v-text="modalTitle" />
                    <hbl-button class="button-icon button-close-modal" @click.native="closeModal">
                        <svg-icon icon="x" />
                    </hbl-button>
                </div>
              <div v-if="actionType === 'select'" class="select-wrp">
                  <div  v-for="address in addresses" class="billing-address-wrp">
                      <div>
                          <span v-text="getSalutationById(address.salutationId)" />
                          <span v-text="address.firstName" />
                          <span v-text="address.lastName" />
                      </div>
                      <div>
                          <span v-text="address.street" />
                      </div>
                      <div>
                          <span v-text="address.zipcode" />
                          <span v-text="address.city" />
                      </div>
                      <div>
                          <span v-text="getCountryById(address.countryId)" />
                      </div>
                      <hbl-button
                          class="button"
                          @click.native="submitSelectAddress(address)"
                          v-text="'Select this address'"
                      />
                  </div>
              </div>
                <form v-else class="form-edit">
                    <hbl-select>
                        <select v-model="address.salutationId" class="select-text" required>
                            <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">
                                {{ salutation.translated.displayName }}
                            </option>
                        </select>
                        <label class="select-label" v-text="'Salutation'" />
                    </hbl-select>

                    <div class="form-row">
                        <hbl-input class="firstname-input">
                            <input
                                id="firstName"
                                v-model="address.firstName"
                                type="text"
                                name="firstName"
                                value=""
                                placeholder=" "
                                required
                            />

                            <label for="firstName" v-text="'First Name'" />
                        </hbl-input>

                        <hbl-input class="lastname-input">
                            <input
                                id="lastName"
                                v-model="address.lastName"
                                type="text"
                                name="lastName"
                                value=""
                                placeholder=" "
                                required
                            />

                            <label for="lastName" v-text="'Last Name'" />
                        </hbl-input>
                    </div>
                    <hbl-input>
                        <input
                            id="street"
                            v-model="address.street"
                            type="text"
                            name="street"
                            value=""
                            placeholder=" "
                            required
                        />

                        <label for="street" v-text="'Street'" />
                    </hbl-input>

                    <div class="form-row">
                        <hbl-input class="zipcode-input">
                            <input
                                id="zipcode"
                                v-model="address.zipcode"
                                type="text"
                                name="zipcode"
                                value=""
                                placeholder=" "
                                required
                            />

                            <label for="zipcode" v-text="'Zipcode'" />
                        </hbl-input>

                        <hbl-input class="city-input">
                            <input
                                id="city"
                                v-model="address.city"
                                type="text"
                                name="city"
                                value=""
                                placeholder=" "
                                required
                            />

                            <label for="city" v-text="'City'" />
                        </hbl-input>
                    </div>

                    <hbl-select>
                        <select id="country" v-model="address.countryId" class="select-text" required>
                            <option
                                v-for="country in countries"
                                :key="country.id"
                                :value="country.id"
                                v-text="country.name"
                            />
                        </select>

                        <label for="country" class="select-label" v-text="'Country'" />
                    </hbl-select>

                    <hbl-button class="button-primary" @click.native="submitForm" v-text="'Save'" />
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
import apiClient from "@/utils/api-client";

export default {
    name: 'PaymentAddresses',

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
            addresses: [],
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
        differentShippingAddress: function () {
            if(this.activeBillingAddress != null && this.activeShippingAddress != null) {
                return this.activeBillingAddress.id !== this.activeShippingAddress.id;
            }
            return false;
        },
        modalTitle: function () {
            return this.actionType + ' ' + this.contextType + ' address';
        }
    },

    created() {
        Vue.use(vClickOutside);
    },

    async mounted() {
        try {
            let [salutationResponse, countryResponse] = await this.fetchFormOptions();
            this.salutations = salutationResponse.data;
            this.countries = countryResponse.data.elements;

            // Fetch current context (activeBillingAddress and activeShippingAddress)
            let contextResponse = await this.fetchContext();
            if(contextResponse.data.customer != null) {
                this.activeBillingAddress = contextResponse.data.customer.activeBillingAddress;
                this.activeShippingAddress = contextResponse.data.customer.activeShippingAddress;
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
        fetchFormOptions: async function() {
            return await Promise.all([this.fetchSalutations(), this.fetchCountries()]);
        },
        fetchSalutations: async function() {
            return await new apiClient().apiCall({
                action: 'get',
                endpoint: 'store-api/v3/salutation'
            });
        },
        fetchCountries: async function() {
            return await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/country',
                data: {
                    filter: [
                        {
                            type: 'equals',
                            field: 'active',
                            value: true
                        },
                        {
                            type: 'equals',
                            field: 'shippingAvailable',
                            value: true
                        }
                    ],
                    sort: [
                        {
                            field: 'position',
                            order: 'ASC'
                        }
                    ]
                }
            });
        },
        fetchContext: async function() {
            return await new apiClient().apiCall({
                action: 'get',
                endpoint: 'store-api/v3/context',
                contextToken: this.contextToken
            });
        },
        fetchAddresses: async function() {
          return await new apiClient().apiCall({
            action: 'post',
            endpoint: 'store-api/v3/account/list-address',
            contextToken: this.contextToken
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
        },
        updateAddressCall: async function(address) {
            return await new apiClient().apiCall({
                action: 'patch',
                endpoint: `store-api/v3/account/address/${address.id}`,
                contextToken: this.contextToken,
                data: address
            });
        },
        setActiveAddressToContext: async function(payload) {
            return await new apiClient().apiCall({
                action: 'patch',
                endpoint: 'store-api/v3/context',
                contextToken: this.contextToken,
                data: payload
            });
        },
        createAddress(type) {
            this.actionType = 'create';
            this.contextType = type;
            this.modalOpen = true;
        },

        async selectAddress(type) {
            const response = await this.fetchAddresses();
            console.log(response)
            let addresses = response.data.elements




            if(type === 'shipping') {
                addresses = addresses.filter(address => address.id !== this.activeBillingAddress.id);
            }
            if(type === 'billing') {
                addresses = addresses.filter(address => address.id !== this.activeShippingAddress.id);
            }

            this.addresses = addresses;
            this.actionType = 'select';
            this.contextType = type;
            this.modalOpen = true;
        },
        submitSelectAddress(address) {
          this.address = address;
          this.submitForm();
        },
        createAddressCall: async function(address) {
            return await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/account/address',
                contextToken: this.contextToken,
                data: address
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
                let response = {};

                if (this.actionType === 'update') {
                    response = await this.updateAddressCall(this.address);
                    addressId = response.data.id;
                }
                if (this.actionType === 'create') {
                    response = await this.createAddressCall(this.address);
                    addressId = response.data.id;
                }
                if (this.actionType === 'select') {
                    response.data = this.address;
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
        }
    }
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
    .billing-address-wrp,
    .shipping-address-wrp {
        border: 1px solid $border-color;
        padding: 20px;
        position: relative;
        width: 100%;

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
        display: flex;
        justify-content: center;
        align-items: flex-end;

        .edit-address-wrp {
            display: flex;
            flex-direction: column;
            background: $white;
            overflow-y: scroll;

            .modal-headline {
                position: relative;
                width: 100%;
                border-bottom: 1px solid $border-color;
                padding: 17px 15px 14px 15px;
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

            .form-edit, .select-wrp {
                padding: 30px 20px 16px 20px;
                width: 100%;
            }

            .form-edit {
                .hbl-input-group, .hbl-select {
                    margin-bottom: 10px;
                }

                .form-row {
                    display: flex;
                    width: 100%;
                    justify-content: space-between;


                    // change to ids
                    .zipcode-input {
                        width: 32%;
                    }

                    .city-input {
                        width: 66%;
                    }

                    .firstname-input {
                        width: 48%;
                    }

                    .lastname-input {
                        width: 50%;
                    }
                }

                .button-primary {
                    width: 100%;
                    margin-top: 10px;
                }
            }
        }
    }

    .edit-address {
        position: absolute;
        top: 20px;
        right: 20px;
    }

    .link {
        text-decoration: underline;
        cursor: pointer;
    }

    .address-headline {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
}

@media (min-width: 1024px) {
    .customer-addresses-wrp {
        .edit-address-modal {
            justify-content: center;

            .edit-address-wrp {
                margin: auto;
                width: 640px;
                max-width: 640px;
                max-height: 640px;
                overflow: scroll;

                .form-edit {
                    padding: 30px 40px 40px 40px
                }
            }
        }
    }
}
</style>
