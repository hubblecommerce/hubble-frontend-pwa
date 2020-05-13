<template>
    <div class="container checkout-login customer-login">
        <tabs v-if="$mq === 'sm' || $mq === 'md'" class="checkout-login-tabs" :default-tab="1">
            <tab class="login-tab" :name="$t('Login')">
                <div class="checkout-login-wrp">
                    <login-form />
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
                </div>
            </div>

            <div v-else>
                <div class="checkout-login-wrp w-50 ml-auto mr-auto back-button">
                    <button class="button-secondary" @click="toggleLoginForm()">
                        {{ $t('Back') }}
                        <material-ripple />
                    </button>
                </div>
                <div class="checkout-register-wrp w-50 ml-auto mr-auto">
                    <div class="headline headline-3" v-text="$t('I am not having an account yet')" />
                    <button v-if="!showRegisterForm" class="button-primary" @click="toggleRegisterForm()">
                        {{ $t('Register') }}
                        <material-ripple />
                    </button>
                    <register-form v-if="showRegisterForm" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LoginForm from '../../components/customer/LoginForm';
import Tabs from "../../components/utils/Tabs";
import Tab from "../../components/utils/Tab";
import RegisterForm from "../../components/customer/RegisterForm";

export default {

    name: 'CustomerLogin',

    components: {
        RegisterForm,
        LoginForm,
        Tabs,
        Tab
    },

    layout: 'hubble',

    middleware: [
        'apiAuthenticate',
        'apiLocalization',
        'apiResourceMenu',
        'trackClickPath'
    ],

    data() {
        return {
            showLoginForm: true,
            showRegisterForm: false
        }
    },

    methods: {
        toggleLoginForm: function() {
            this.showLoginForm = !this.showLoginForm;
            this.showRegisterForm = false;
        },
        toggleRegisterForm: function() {
            this.showRegisterForm = !this.showRegisterForm;
            this.showLoginForm = false;
        }
    },

    head() {
        return {
            meta: [
                { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }
            ]
        }
    }

}
</script>
