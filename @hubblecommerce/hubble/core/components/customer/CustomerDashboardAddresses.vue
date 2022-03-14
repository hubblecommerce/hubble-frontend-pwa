<template>
    <div v-if="!isLoading" class="customer-addresses-wrp">
        <div class="box">
            <p class="box-title">Billing address:</p>
            <address-box
                :address="activeBillingAddress"
                :salutations="salutations"
                :countries="countries"
                :updateAddressParent="updateAddress"
                type="billing"
            />
        </div>

        <div class="box">
            <p class="box-title">Shipping address:</p>
            <address-box
                :address="activeShippingAddress"
                :salutations="salutations"
                :countries="countries"
                :updateAddressParent="updateAddress"
                type="shipping"
            />
        </div>

        <address-modal
            v-if="modalOpen"
            :closeModalFunction="closeModal"
            :countries="countries"
            :salutations="salutations"
            :currentAddress="address"
            :context="contextType"
            :updateAddressFunction="updateAddress"
        />
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';
import vClickOutside from 'v-click-outside';
import ApiClient from '@/utils/api-client';

export default {
    name: 'CustomerDashboardAddresses',

    props: {
        amazonPayScriptIsLoaded: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

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
        isAmazonCheckout: function () {
            if (this.$router.currentRoute.query.oneClickCheckout != null && this.$router.currentRoute.query.amazonCheckoutSessionId != null) {
                return true;
            }

            return false;
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
            showOffcanvasAction: 'modNavigation/showOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
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
            this.showOffcanvasAction({
                component: '',
            });

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
            this.hideOffcanvasAction();
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
        amazonBindChangeAction: function () {
            window.amazon.Pay.bindChangeAction(`#${this.$refs['amazon-pay-change-shipping'].$el.id}`, {
                amazonCheckoutSessionId: this.$router.currentRoute.query.amazonCheckoutSessionId,
                changeAction: 'changeAddress',
            });

            this.$refs['amazon-pay-change-shipping'].$el.click();
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
    margin-bottom: $base-padding-md;

    .headline {
        margin-bottom: $base-padding-md;
    }

    .billing-address-wrp,
    .shipping-address-wrp {
        border: 1px solid $border-color;
        padding: $base-padding-md;
        position: relative;

        margin-bottom: $base-padding-md;
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
                padding: $base-padding-md;
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
                padding: $base-padding-md;
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

@media (max-width: 576px) {
    .customer-dashboard {
        .content-wrp {
            .box {
                .box-title {
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
