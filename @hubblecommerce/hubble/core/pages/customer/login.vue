<template>
    <div class="container customer-login-wrp">
        <tabs v-if="$mq === 'sm' || $mq === 'md'" class="checkout-login-tabs" :default-tab="defaultTab">
            <tab class="login-tab" :name="$t('Login')">
                <div class="customer-login-wrp">
                    <login-form />
                </div>
            </tab>
            <tab class="register-tab" :name="$t('Register')">
                <div class="customer-register-wrp">
                    <div class="headline headline-3" v-text="$t('I am not having an account yet')" />
                    <register-form />
                </div>
            </tab>
        </tabs>

        <div v-if="$mq === 'lg'" class="checkout-login-desktop-wrp">
            <div v-if="showLoginForm" class="row">
                <div class="col-12">
                    <login-form />
                </div>

                <div class="col-12">
                    <div class="register-form">
                        <div class="headline headline-3" v-text="$t('I am not having an account yet')" />
                        <button v-if="!showRegisterForm" class="button-primary" @click="toggleRegisterForm()">
                            {{ $t('Register') }}
                            <material-ripple />
                        </button>
                    </div>
                </div>
            </div>

            <div v-else>
                <div class="customer-register-wrp">
                    <button
                        class="button-secondary button-back button-secondary button-back w-100 mb-3"
                        @click="toggleLoginForm()"
                    >
                        {{ $t('Back') }}
                        <material-ripple />
                    </button>

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
import Tabs from '../../components/utils/Tabs';
import Tab from '../../components/utils/Tab';
import RegisterForm from '../../components/customer/RegisterForm';

export default {
    name: 'CustomerLogin',

    components: {
        RegisterForm,
        LoginForm,
        Tabs,
        Tab,
    },

    layout: 'hubble',

    middleware: ['apiAuthenticate', 'apiLocalization', 'apiResourceMenu', 'trackClickPath'],

    data() {
        return {
            showLoginForm: true,
            showRegisterForm: false,
            defaultTab: 0,
        };
    },

    head() {
        return {
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }],
        };
    },

    created() {
        if (this.$route.query.tab !== undefined) {
            this.defaultTab = parseInt(this.$route.query.tab, 10);
        }
    },

    methods: {
        toggleLoginForm: function () {
            this.showLoginForm = !this.showLoginForm;
            this.showRegisterForm = false;
        },
        toggleRegisterForm: function () {
            this.showRegisterForm = !this.showRegisterForm;
            this.showLoginForm = false;
        },
    },
};
</script>
