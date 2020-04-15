<template>
    <div class="container checkout-login">
        <tabs v-if="$mq === 'sm' || $mq === 'md'" class="checkout-login-tabs">
            <tab class="login-tab" :name="$t('Login')">
                <div v-if="showLoginForm" class="checkout-login-wrp">
                    <login-form />
                </div>
                <div class="guest-login-wrp">
                    <button v-if="!showLoginForm" class="button-secondary back-button" @click="toggleLoginForm()">
                        {{ $t('Back') }}
                        <material-ripple />
                    </button>
                    <div class="headline headline-3" v-text="$t('Do not register')" />

                    <button v-if="!showRegisterGuestForm" class="button-secondary" @click="toggleRegisterGuestForm()" v-text="$t('Guest order')" />
                    <register-form v-if="showRegisterGuestForm" :guest="true" />
                </div>
            </tab>
            <tab class="register-tab" :name="$t('Register')">
                <div class="checkout-register-wrp">
                    <div class="headline headline-3" v-text="$t('I am not having an account yet')" />
                    <register-form />
                </div>
            </tab>
        </tabs>

        <div v-if="$mq === 'lg'" class="checkout-login-desktop-wrp">
            <div v-if="showLoginForm" class="login-desktop-wrp">
                <div class="checkout-login-wrp">
                    <login-form />
                </div>
                <div>
                    <div class="checkout-register-wrp">
                        <div class="headline headline-3" v-text="$t('I am not having an account yet')" />
                        <button v-if="!showRegisterForm" class="button-primary" @click="toggleRegisterForm()">
                            {{ $t('Register') }}
                            <material-ripple />
                        </button>
                    </div>
                    <div class="guest-login-wrp">
                        <div class="headline headline-3" v-text="$t('Do not register')" />
                        <button v-if="!showRegisterGuestForm" class="button-secondary" @click="toggleRegisterGuestForm()">
                            {{ $t('Guest order') }}
                            <material-ripple />
                        </button>
                    </div>
                </div>
            </div>

            <div v-else>
                <div class="checkout-login-wrp w-50 ml-auto mr-auto back-button">
                    <button class="button-secondary" @click="toggleLoginForm()">
                        {{ $t('Back') }}
                        <material-ripple />
                    </button>
                </div>
                <div v-if="!showRegisterGuestForm" class="checkout-register-wrp w-50 ml-auto mr-auto">
                    <div class="headline headline-3" v-text="$t('I am not having an account yet')" />
                    <button v-if="!showRegisterForm" class="button-primary" @click="toggleRegisterForm()">
                        {{ $t('Register') }}
                        <material-ripple />
                    </button>
                    <register-form v-if="showRegisterForm" />
                </div>
                <div class="guest-login-wrp w-50 ml-auto mr-auto">
                    <div class="headline headline-3" v-text="$t('Do not register')" />
                    <button v-if="!showRegisterGuestForm" class="button-secondary" @click="toggleRegisterGuestForm()">
                        {{ $t('Guest order') }}
                        <material-ripple />
                    </button>
                    <register-form v-if="showRegisterGuestForm" :guest="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LoginForm from '../../components/customer/LoginForm';
import Tabs from '../../components/utils/Tabs';
import Tab from '../../components/utils/Tab';
import RegisterForm from '../../components/customer/RegisterForm';

export default {
    name: 'Login',

    components: {
        RegisterForm,
        LoginForm,
        Tabs,
        Tab,
    },

    middleware: ['apiAuthenticate', 'apiPaymentAuthenticate', 'apiLocalization', 'trackClickPath'],

    layout: 'hubble_light',

    data() {
        return {
            showLoginForm: true,
            showRegisterForm: false,
            showRegisterGuestForm: false,
        };
    },

    methods: {
        toggleLoginForm: function () {
            this.showLoginForm = !this.showLoginForm;
            this.showRegisterForm = false;
            this.showRegisterGuestForm = false;
        },
        toggleRegisterForm: function () {
            this.showRegisterForm = !this.showRegisterForm;
            this.showLoginForm = false;
            this.showRegisterGuestForm = false;
        },
        toggleRegisterGuestForm: function () {
            // If shopware mode, redirect to shopware guest checkout
            if (process.env.API_TYPE === 'sw') {
                this.$router.push({ path: this.localePath('checkout-shopware-guest') });
                return;
            }

            this.showRegisterGuestForm = !this.showRegisterGuestForm;
            this.showLoginForm = false;
            this.showRegisterForm = false;
        },
    },

    head() {
        return {
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }],
        };
    },
};
</script>
