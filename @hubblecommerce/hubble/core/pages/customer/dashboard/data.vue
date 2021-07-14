<template>
    <div class="col-sm-12 col-md-9 content-wrp">
        <div class="row">
            <div class="col-12">
                <div class="box account-info-wrp">
                    <div class="box-title" v-text="'Personal data'" />
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

                    <div class="box-content" v-if="!isLoading">
                        <form class="form-edit">
                            <div class="row salutation-row">
                                <div class="col-4">
                                    <hbl-select>
                                        <select v-model="customer.salutationId" class="select-text" required>
                                            <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">
                                                {{ salutation.translated.displayName }}
                                            </option>
                                        </select>
                                        <label class="select-label" v-text="'Salutation'" />
                                    </hbl-select>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <hbl-input>
                                        <input
                                            id="firstName"
                                            v-model="customer.firstName"
                                            type="text"
                                            name="firstName"
                                            value=""
                                            placeholder=" "
                                            required
                                        />

                                        <label for="firstName" v-text="'Firstname'" />
                                    </hbl-input>
                                </div>
                                <div class="col-12 col-md-6">
                                    <hbl-input>
                                        <input
                                            id="lastName"
                                            v-model="customer.lastName"
                                            type="text"
                                            name="lastName"
                                            value=""
                                            placeholder=" "
                                            required
                                        />

                                        <label for="lastName" v-text="'Lastname'" />
                                    </hbl-input>
                                </div>
                            </div>
                            <hbl-button class="button-primary w-100" @click.native="submitProfile" v-text="'Save'" type="button" />
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="box account-info-wrp">
                    <div class="box-title">Credentials</div>
                    <div class="change-tabs">
                        <p><b>Mail address:</b> {{ customer.email }}</p>
                        <p class="tab-link" @click="toggleTab('email')"> Edit mail address </p>
                        <p class="tab-link" @click="toggleTab('password')"> Edit password </p>
                    </div>
                    <div class="tab-password" v-if="activeTab == 'password'">
                        <div class="box-title">Edit password</div>

                        <form @submit.prevent="submitPassword()">
                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <hbl-input>
                                        <input
                                            id="newPassword"
                                            v-model="updatedPassword.newPassword"
                                            type="password"
                                            name="newPassword"
                                            value=""
                                            placeholder=" "
                                            required
                                        />

                                        <label for="newPassword" v-text="'New password'" />
                                    </hbl-input>
                                </div>
                                <div class="col-12 col-md-6">
                                    <hbl-input>
                                        <input
                                            id="newPasswordConfirm"
                                            v-model="updatedPassword.newPasswordConfirm"
                                            type="password"
                                            name="newPasswordConfirm"
                                            value=""
                                            placeholder=" "
                                            required
                                        />

                                        <label for="newPasswordConfirm" v-text="'Password confirmation'" />
                                    </hbl-input>
                                </div>
                                <div class="col-12 col-md-6">
                                    <hbl-input>
                                        <input
                                            id="password"
                                            v-model="updatedPassword.password"
                                            type="password"
                                            name="password"
                                            value=""
                                            placeholder=" "
                                            required
                                        />

                                        <label for="password" v-text="'Current password'" />
                                    </hbl-input>
                                </div>
                            </div>
                            <hbl-button class="button-primary w-100" v-text="'Save'" @click.prevent="submitPassword()" />
                        </form>
                    </div>
                    <div class="tab-email" v-if="activeTab == 'email'">
                        <div class="box-title">Edit mail address</div>

                        <form @submit.prevent="submitEmail()">
                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <hbl-input>
                                        <input id="email" v-model="updatedEmail.email" type="text" name="email" value="" placeholder=" " required />

                                        <label for="email" v-text="'New mail address'" />
                                    </hbl-input>
                                </div>
                                <div class="col-12 col-md-6">
                                    <hbl-input>
                                        <input
                                            id="emailConfirmation"
                                            v-model="updatedEmail.emailConfirmation"
                                            type="text"
                                            name="emailConfirmation"
                                            value=""
                                            placeholder=" "
                                            required
                                        />

                                        <label for="emailConfirmation" v-text="'Mail address confirmation'" />
                                    </hbl-input>
                                </div>
                                <div class="col-12 col-md-6">
                                    <hbl-input>
                                        <input
                                            id="password"
                                            v-model="updatedEmail.password"
                                            type="password"
                                            name="password"
                                            value=""
                                            placeholder=" "
                                            required
                                        />

                                        <label for="password" v-text="'Password'" />
                                    </hbl-input>
                                </div>
                            </div>
                            <hbl-button class="button-primary w-100" v-text="'Save'" @click.prevent="submitEmail()" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/utils/api-client';
import { mapState } from 'vuex';

export default {
    name: 'CustomerData',
    props: ['customer'],
    data() {
        return {
            isLoading: true,
            salutations: [],
            showMessage: false,
            successMsg: '',
            activeTab: null,
            updatedPassword: {
                newPassword: null,
                newPasswordConfirm: null,
                password: null,
            },
            updatedEmail: {
                email: null,
                emailConfirmation: null,
                password: null,
            },
        };
    },

    async mounted() {
        try {
            let salutationResponse = await this.fetchSalutations();
            this.salutations = salutationResponse.data.elements;
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
    },
    methods: {
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
        fetchSalutations: async function () {
            return await new apiClient().apiCall({
                action: 'get',
                endpoint: 'store-api/salutation',
            });
        },
        submitProfile: async function () {
            try {
                await new apiClient().apiCall({
                    action: 'post',
                    endpoint: 'store-api/account/change-profile',
                    contextToken: this.contextToken,
                    data: {
                        salutationId: this.customer.salutationId,
                        firstName: this.customer.firstName,
                        lastName: this.customer.lastName,
                    },
                });
                this.successMsg = 'Änderungen gespeichert';
                this.showMessage = true;
                this.success = true;
            } catch (e) {
                this.successMsg = e.detail;
                this.showMessage = true;
                this.success = false;
            }
        },
        submitPassword: async function () {
            try {
                let response = await new apiClient().apiCall({
                    action: 'post',
                    endpoint: 'store-api/account/change-password',
                    contextToken: this.contextToken,
                    data: this.updatedPassword,
                });

                this.successMsg = 'Passwortänderung gespeichert';
                this.showMessage = true;
                this.success = true;
            } catch (e) {
                this.successMsg = e.detail;
                this.showMessage = true;
                this.success = false;
            }
        },
        submitEmail: async function () {
            try {
                let response = await new apiClient().apiCall({
                    action: 'post',
                    endpoint: 'store-api/account/change-email',
                    contextToken: this.contextToken,
                    data: this.updatedEmail,
                });

                this.successMsg = 'E-Mail-Änderung gespeichert';
                this.showMessage = true;
                this.success = true;
                this.customer.email = this.updatedEmail.email;
            } catch (e) {
                this.successMsg = e.detail;
                this.showMessage = true;
                this.success = false;
            }
        },
        toggleTab(tab) {
            if (this.activeTab == tab) {
                this.activeTab = null;
            } else {
                this.activeTab = tab;
            }
        },
    },
};
</script>
<style lang="scss">
@import '~assets/scss/hubble/alerts';
@import '~assets/scss/hubble/variables';

.change-tabs {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (min-width: 768px) {
        flex-direction: row;
    }

    .tab-link {
        color: $primary;
        cursor: pointer;
        font-weight: bold;

        &:hover {
            text-decoration: underline;
        }
    }
}

.salutation-row {
    margin-bottom: 1rem;
}
</style>
