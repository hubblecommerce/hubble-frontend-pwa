<template>
    <div class="edit-address-modal" role="document">
        <div class="edit-address-wrp" v-click-outside="closeModalFunction" v-if="!isLoading">
            <div class="close-row">
                <button @click="closeModalFunction">X</button>
            </div>
            <div class="currentAddress">
                <p class="title">Current billing address</p>
                <div>
                    <span v-text="getSalutationById(currentAddress.salutationId)" />
                    <span v-text="currentAddress.firstName" />
                    <span v-text="currentAddress.lastName" />
                </div>
                <div>
                    <span v-text="currentAddress.street" />
                </div>
                <div>
                    <span v-text="currentAddress.zipcode" />
                    <span v-text="currentAddress.city" />
                </div>
                <div>
                    <span v-text="getCountryById(currentAddress.countryId)" />
                </div>
            </div>
            <div class="tab-control-row">
                <button @click="editAddress" :class="{ active: tab == 'edit' }" class="button"> Edit address </button>
                <button @click="chooseAddress" :class="{ active: tab == 'choose' }" class="button"> Choose address </button>
                <button @click="addAddress" :class="{ active: tab == 'add' }" class="button"> Add new address </button>
            </div>

            <div class="address-tabs">
                <div class="tab-edit" v-if="tab == 'edit' || tab == 'add'">
                    <form class="form-edit" @submit.prevent="submitForm">
                        <div
                            v-if="showMessage"
                            class="alert"
                            :class="{
                                'alert-danger': !success,
                                'alert-success': success,
                            }"
                            role="alert"
                        >
                            <span>{{ successMsg }}</span>
                        </div>
                        <hbl-select>
                            <select v-model="editorAddress.salutationId" class="select-text" required>
                                <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">
                                    {{ salutation.translated.displayName }}
                                </option>
                            </select>
                            <label class="select-label" v-text="'Salutation'" />
                        </hbl-select>

                        <hbl-input>
                            <input id="firstName" v-model="editorAddress.firstName" type="text" name="firstName" value="" placeholder=" " required />

                            <label for="firstName" v-text="'Firstname'" />
                        </hbl-input>

                        <hbl-input>
                            <input id="lastName" v-model="editorAddress.lastName" type="text" name="lastName" value="" placeholder=" " required />

                            <label for="lastName" v-text="'Lastname'" />
                        </hbl-input>

                        <hbl-input>
                            <input id="street" v-model="editorAddress.street" type="text" name="street" value="" placeholder=" " required />

                            <label for="street" v-text="'Street'" />
                        </hbl-input>

                        <div class="form-row zip-city">
                            <hbl-input>
                                <input id="zipcode" v-model="editorAddress.zipcode" type="text" name="zipcode" value="" placeholder=" " required />

                                <label for="zipcode" v-text="'Zip'" />
                            </hbl-input>

                            <hbl-input>
                                <input id="city" v-model="editorAddress.city" type="text" name="city" value="" placeholder=" " required />

                                <label for="city" v-text="'City'" />
                            </hbl-input>
                        </div>

                        <hbl-select>
                            <select id="country" v-model="editorAddress.countryId" class="select-text" required>
                                <option v-for="country in countries" :key="country.id" :value="country.id" v-text="country.name" />
                            </select>

                            <label for="country" class="select-label" v-text="'Country'" />
                        </hbl-select>

                        <button class="button-primary w-100" @click="submitForm()" v-text="'Save'" type="button">Save</button>
                    </form>
                </div>
                <div class="tab-choose" v-if="tab == 'choose'">
                    <p class="title">Available addresses</p>
                    <div class="address" v-for="address in remainingAddresses" :key="address.id">
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
                        <button class="button button-secondary" @click="useAsStandard(address.id)"> Choose as default </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import apiClient from '@/utils/api-client';

export default {
    name: 'AddressModal',
    props: ['closeModalFunction', 'currentAddress', 'salutations', 'countries', 'context', 'updateAddressFunction'],

    data() {
        return {
            isLoading: true,
            addresses: [],
            tab: 'choose',
            editorAddress: {},
            showMessage: false,
            successMsg: '',
        };
    },

    async mounted() {
        try {
            this.addresses = await this.fetchUserAddresses();
            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
            throw e;
        }
    },
    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
        remainingAddresses() {
            return this.addresses.data.elements.filter((address) => address.id != this.currentAddress.id);
        },
    },

    methods: {
        async fetchUserAddresses() {
            return await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/account/list-address',
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
        async useAsStandard(id) {
            console.log('standard');
            let response = await new apiClient().apiCall({
                action: 'patch',
                endpoint: `store-api/account/address/default-${this.context}/${id}`,
                contextToken: this.contextToken,
            });

            if (response.status == 204) {
                let newAddress = this.remainingAddresses.find((address) => address.id == id);
                console.log(newAddress);
                this.updateAddressFunction(newAddress, this.context);
            }
        },
        editAddress() {
            this.tab = 'edit';
            this.editorAddress = this.currentAddress;
        },
        chooseAddress() {
            this.tab = 'choose';
        },
        addAddress() {
            this.tab = 'add';
            this.editorAddress = {};
        },
        submitForm() {
            if (this.tab == 'edit') {
                this.updateAddress(this.editorAddress);
            } else if (this.tab == 'add') {
                this.createAddress(this.editorAddress);
            }
        },
        async createAddress(address) {
            try {
                let response = await new apiClient().apiCall({
                    action: 'post',
                    endpoint: 'store-api/account/address',
                    contextToken: this.contextToken,
                    data: address,
                });
                this.successMsg = 'Änderung gespeichert';
                this.showMessage = true;
                this.success = true;
            } catch (e) {
                this.successMsg = e.detail;
                this.showMessage = true;
                this.success = false;
            }
        },
        async updateAddress(address) {
            try {
                let response = await new apiClient().apiCall({
                    action: 'patch',
                    endpoint: `store-api/account/address/${address.id}`,
                    contextToken: this.contextToken,
                    data: address,
                });

                this.successMsg = 'Änderung gespeichert';
                this.showMessage = true;
                this.success = true;
            } catch (e) {
                this.successMsg = e.detail;
                this.showMessage = true;
                this.success = false;
            }
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.edit-address-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    overflow: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;

    .close-row {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        width: 100%;
        margin-top: 1rem;
    }

    .edit-address-wrp {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        background: $white;
        padding: 0rem 1rem;

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

    .tab-control-row {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 1rem;

        .button {
            margin-bottom: 0.5rem;
        }

        @media (min-width: 768px) {
            flex-direction: row;
        }

        .active {
            background-color: $primary;
            color: white;
        }
    }

    .address-tabs,
    .currentAddress {
        width: 100%;
        padding-bottom: 1rem;
        .title {
            border-bottom: 1px solid #bcc1c7;
            padding-bottom: 10px;
            color: #4a545b;
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 0.75rem;
        }

        .tab-choose {
            .address {
                padding-top: 1rem;
                padding-bottom: 1rem;

                &:not(:last-child) {
                    border-bottom: 1px solid #bcc1c7;
                }
            }
        }
    }
}

@media (min-width: 1024px) {
    .customer-addresses-wrp {
        .edit-address-modal {
            justify-content: center;

            .edit-address-wrp {
                margin: auto;
                width: auto;
                max-width: 800px;
                height: auto;
                overflow: visible;
            }
        }
    }
}
</style>
