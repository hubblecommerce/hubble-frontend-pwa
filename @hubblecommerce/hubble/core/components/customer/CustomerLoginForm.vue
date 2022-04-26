<template>
    <div class="customer-login-form-wrp">
        <form @submit.prevent="submitLoginForm" v-if="showLoginForm" class="login-form">
            <div class="headline headline-5 " v-text="'I already have an account'" />

            <hbl-input>
                <input v-model="email" id="email" type="text" placeholder=" " autocomplete="username" required />
                <label for="email" v-text="'Email Address'" />
            </hbl-input>

            <hbl-input>
                <input v-model="password" id="password" type="password" placeholder=" " autocomplete="current-password" required />
                <label for="password" v-text="'Password'" />
            </hbl-input>

            <template v-for="error in errors">
                <div class="error-message" v-text="error" />
            </template>

            <div class="pw-reset" @click.prevent="toggleLoginForm" v-text="'Reset your Password'" />

            <hbl-button class="button-primary" :disabled="isLoading" @click.prevent="submitLoginForm">
                {{ 'Login' }}
            </hbl-button>
        </form>

        <form v-if="!showLoginForm" class="pw-reset-form">
            <div class="headline headline-3" v-text="'Reset your Password'" />

            <hbl-input>
                <input v-model="email" id="pw-reset-email" type="text" placeholder=" " autocomplete="username" required />
                <label for="pw-reset-email" v-text="'Email Address'" />
            </hbl-input>

            <template v-for="error in errors">
                <div class="error-message" v-text="error" />
            </template>

            <div class="pw-reset" @click.prevent="toggleLoginForm" v-text="'Login'" />

            <hbl-button class="button-primary" :disabled="isLoading" @click.native="submitPwResetForm">
                {{ 'Reset password' }}
            </hbl-button>
        </form>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ApiClient from '@/utils/api-client';

export default {
    name: 'CustomerLoginForm',

    data() {
        return {
            isLoading: false,
            showLoginForm: true,
            email: '',
            password: '',
            errors: [],
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
    },

    methods: {
        ...mapMutations({
            setContextToken: 'modSession/setContextToken',
        }),
        toggleLoginForm: function () {
            this.errors = [];
            this.showLoginForm = !this.showLoginForm;
        },
        submitLoginForm: async function () {
            try {
                this.isLoading = true;

                if (this.contextToken === null) {
                    await this.fetchContext();
                }

                let response = await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: 'store-api/account/login',
                    contextToken: this.contextToken,
                    data: {
                        username: this.email,
                        password: this.password,
                    },
                });

                // this.flashMessage({
                //    type: 'success',
                //    text: 'Successfully logged in.'
                // });

                if (response.data.contextToken != null) {
                    this.setContextToken(response.data.contextToken);
                    this.$emit('login-success');
                }

                this.isLoading = false;
            } catch (e) {
                this.isLoading = false;
                this.errors.push(e.detail);
            }
        },
        fetchContext: async function() {
            let response = await new ApiClient(this.$config).apiCall({
                action: 'get',
                endpoint: 'store-api/context',
            });

            this.setContextToken(response.data['token']);
        },
        submitPwResetForm: async function () {
            try {
                this.isLoading = true;
                await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: 'store-api/account/recovery-password',
                    data: {
                        email: this.email,
                        storefrontUrl: this.$config.apiBaseUrl,
                    },
                });

                // Reset data
                this.showLoginForm = true;
                this.email = '';
                this.password = '';
                this.errors = [];

                this.$emit('pw-reset-success');

                //this.flashMessage({
                //    type: 'success',
                //    text: 'We send you an email with further instructions to reset your password.'
                //});

                this.isLoading = false;
            } catch (e) {
                this.errors.push(e.detail);
                this.isLoading = false;
            }
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.customer-login-form-wrp {
    padding: 40px 0 20px;
}

.login-form,
.pw-reset-form,
.express-checkout-wrp {
    background-color: #fff;
    margin: 0 auto;
    padding: 0;
    max-width: $form-max-width;

    .headline {
        margin-bottom: 20px;
    }

    .title {
        font-size: 28px;
        line-height: 30px;
        margin-bottom: 25px;
    }

    .pw-reset {
        color: $secondary;
        text-decoration: underline;
        text-align: right;
        margin: 0;
        margin-bottom: 6px;
        text-transform: none;
        font-size: 14px;
        cursor: pointer;
    }

    button {
        width: 100%;
        margin: 10px 0;
    }
}
</style>
