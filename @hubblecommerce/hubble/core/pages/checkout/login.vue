<template>
    <div class="container checkout-login-wrp">
        <div class="row">
            <div class="col-12">
                <login-form />
            </div>

            <div class="col-12">
                <div class="register-form">
                    <div class="headline headline-3" v-text="$t('I am not having an account yet')" />
                    <nuxt-link :to="localePath('checkout-register')">
                        <button class="button-primary">
                            {{ $t('Register') }}
                            <material-ripple />
                        </button>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LoginForm from '../../components/customer/LoginForm';
import apiPaymentAuthenticate from '~/anonymous-middleware/apiPaymentAuthenticate';

export default {
    name: 'CheckoutLogin',

    components: {
        LoginForm,
    },

    layout: 'hubble_light',

    middleware: ['apiAuthenticate', apiPaymentAuthenticate, 'apiLocalization', 'trackClickPath'],

    data() {
        return {};
    },

    head() {
        return {
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }],
        };
    },

    methods: {},
};
</script>
