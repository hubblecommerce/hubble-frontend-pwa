<template>
    <div class="register-form-wrp">
        <form @submit.prevent="onSubmit">
            <hbl-input>
                <input v-model="form.email" id="email" type="text" placeholder=" " autocomplete="username" required />
                <label for="email" v-text="'Email Address'" />
            </hbl-input>

            <hbl-checkbox>
                <input id="registerAsGuest" v-model="form.guest" type="checkbox" />
                <label for="registerAsGuest">
                    <svg-icon icon="check" />
                    <span>Do not create an account</span>
                </label>
            </hbl-checkbox>

            <hbl-input v-if="!form.guest">
                <input v-model="form.password" id="password" type="password" placeholder=" " autocomplete="current-password" required />
                <label for="password" v-text="'Password'" />
            </hbl-input>

            <hbl-select>
                <select id="salutation" v-model="form.salutationId" class="select-text" required>
                    <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">
                        {{ salutation.translated.displayName }}
                    </option>
                </select>
                <label for="salutation" class="select-label" v-text="'Salutation'" />
            </hbl-select>

            <hbl-input>
                <input v-model="form.firstName" id="firstName" type="text" placeholder=" " required />
                <label for="firstName" v-text="'First name'" />
            </hbl-input>

            <hbl-input>
                <input v-model="form.lastName" id="lastName" type="text" placeholder=" " required />
                <label for="lastName" v-text="'Last name'" />
            </hbl-input>

            <hbl-input>
                <input v-model="form.billingAddress.company" id="company" type="text" placeholder=" " />
                <label for="company" v-text="'Company (optional)'" />
            </hbl-input>

            <hbl-input>
                <input v-model="form.billingAddress.street" id="street" type="text" placeholder=" " required />
                <label for="street" v-text="'Street'" />
            </hbl-input>

            <div class="form-row zip-city">
                <hbl-input>
                    <input v-model="form.billingAddress.zipcode" id="zipcode" type="text" placeholder=" " required />
                    <label for="zipcode" v-text="'Zipcode'" />
                </hbl-input>

                <hbl-input>
                    <input v-model="form.billingAddress.city" id="city" type="text" placeholder=" " required />
                    <label for="city" v-text="'City'" />
                </hbl-input>
            </div>

            <hbl-input>
                <input v-model="form.billingAddress.phoneNumber" id="phoneNumber" type="text" placeholder=" " />
                <label for="phoneNumber" v-text="'Phone (optional)'" />
            </hbl-input>

            <hbl-select>
                <select id="country" v-model="form.billingAddress.countryId" class="select-text" required>
                    <option v-for="country in countries" :key="country.id" :value="country.id">
                        {{ country.translated.name }}
                    </option>
                </select>
                <label for="country" class="select-label" v-text="'Country'" />
            </hbl-select>

            <hbl-checkbox>
                <input id="sameShippingAddress" v-model="sameShippingAddress" type="checkbox" />
                <label for="sameShippingAddress">
                    <svg-icon icon="check" />
                    <span>Use same address as shipping address</span>
                </label>
            </hbl-checkbox>

            <template v-if="!sameShippingAddress">
                <hbl-select>
                    <select id="shipping-salutation" v-model="shippingAddress.salutationId" class="select-text" required>
                        <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">
                            {{ salutation.translated.displayName }}
                        </option>
                    </select>
                    <label for="shipping-salutation" class="select-label" v-text="'Salutation'" />
                </hbl-select>

                <hbl-input>
                    <input v-model="shippingAddress.firstName" id="shipping-firstName" type="text" placeholder=" " required />
                    <label for="shipping-firstName" v-text="'First name'" />
                </hbl-input>

                <hbl-input>
                    <input v-model="shippingAddress.lastName" id="shipping-lastName" type="text" placeholder=" " required />
                    <label for="shipping-lastName" v-text="'Last name'" />
                </hbl-input>

                <hbl-input>
                    <input v-model="shippingAddress.street" id="shipping-street" type="text" placeholder=" " required />
                    <label for="shipping-street" v-text="'Street'" />
                </hbl-input>

                <div class="form-row zip-city">
                    <hbl-input>
                        <input v-model="shippingAddress.zipcode" id="shipping-zipcode" type="text" placeholder=" " required />
                        <label for="shipping-zipcode" v-text="'Zipcode'" />
                    </hbl-input>

                    <hbl-input>
                        <input v-model="shippingAddress.city" id="shipping-city" type="text" placeholder=" " required />
                        <label for="shipping-city" v-text="'City'" />
                    </hbl-input>
                </div>

                <hbl-select>
                    <select id="shipping-country" v-model="shippingAddress.countryId" class="select-text" required>
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                            {{ country.translated.name }}
                        </option>
                    </select>
                    <label for="shipping-country" class="select-label" v-text="'Country'" />
                </hbl-select>
            </template>

            <template v-for="error in errors">
                <div class="error-message" v-text="error" />
            </template>

            <hbl-button class="button-primary" :disabled="isLoading" @click.prevent="onSubmit">
                <span v-if="!isLoading">{{ 'Register' }}</span>
                <loader v-if="isLoading" />
            </hbl-button>
        </form>
    </div>
</template>

<script>
import ApiClient from '@/utils/api-client';
import { mapMutations, mapState } from 'vuex';

export default {
    name: 'CustomerRegisterForm',

    data() {
        return {
            isLoading: false,
            errors: [],
            salutations: [],
            countries: [],
            sameShippingAddress: true,
            form: {
                guest: false,
                salutationId: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                billingAddress: {
                    countryId: '',
                    street: '',
                    zipcode: '',
                    city: '',
                    phoneNumber: '',
                    company: '',
                },
            },
            shippingAddress: {
                countryId: '',
                salutationId: '',
                firstName: '',
                lastName: '',
                street: '',
                zipcode: '',
                city: '',
            },
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
    },

    async mounted() {
        try {
            let [salutationResponse, countryResponse] = await this.fetchFormOptions();
            this.salutations = salutationResponse.data.elements;
            this.countries = countryResponse.data.elements;
        } catch (e) {
            throw e;
        }
    },

    methods: {
        ...mapMutations({
            setContextToken: 'modSession/setContextToken',
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
        onSubmit: async function () {
            try {
                this.isLoading = true;

                let postData = Object.assign(this.form, {
                    storefrontUrl: this.$config.apiBaseUrl,
                });

                if (!this.sameShippingAddress) {
                    postData = Object.assign(postData, { shippingAddress: this.shippingAddress });
                }

                if (this.contextToken === null) {
                    await this.fetchContext();
                }

                let response = await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: 'store-api/account/register',
                    contextToken: this.contextToken,
                    data: postData,
                });

                if (response.headers['sw-context-token'] != null) {
                    this.setContextToken(response.headers['sw-context-token']);
                    this.$emit('register-success');
                }

                //this.flashMessage({
                //    type: 'success',
                //    text: 'Successfully registered.'
                //});

                this.isLoading = false;
            } catch (e) {
                this.errors.push(e.detail);
                this.isLoading = false;
            }
        },
        fetchContext: async function () {
            let response = await new ApiClient(this.$config).apiCall({
                action: 'get',
                endpoint: 'store-api/context',
            });

            this.setContextToken(response.data['token']);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.register-form-wrp {
    background-color: #fff;
    max-width: $form-max-width;

    .headline {
        margin-bottom: 15px;
    }

    button {
        width: 100%;
    }

    .form-row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        &.zip-city {
            .hbl-input-group:nth-child(1) {
                width: 80px;
            }

            .hbl-input-group:nth-child(2) {
                width: calc(100% - 90px);
            }
        }
    }
}
</style>
