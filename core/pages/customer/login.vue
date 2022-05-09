<template>
    <div class="container customer-login-wrp">
        <tabs v-if="$mq === 'sm' || $mq === 'md'" class="checkout-login-tabs" :default-tab="defaultTab">
            <tab class="login-tab" :name="'Login'">
                <div class="customer-login-wrp">
                    <customer-login-form v-on:login-success="goToCheckout" />
                </div>
            </tab>
            <tab class="register-tab" :name="'Register'">
                <div class="customer-register-wrp">
                    <div class="headline headline-5" v-text="'I am not having an account yet'" />
                    <customer-register-form v-on:register-success="goToCheckout" />
                </div>
            </tab>
        </tabs>

        <div v-if="$mq === 'lg'" class="checkout-login-desktop-wrp">
            <div v-if="showLoginForm" class="row">
                <div class="col-12">
                    <customer-login-form v-on:login-success="goToCheckout" />
                </div>

                <div class="col-12">
                    <div class="customer-register-wrp">
                        <div class="headline headline-5" v-text="'I am not having an account yet'" />
                        <hbl-button v-if="!showRegisterForm" @click.native="toggleRegisterForm()">
                            {{ 'Register' }}
                        </hbl-button>
                    </div>
                </div>
            </div>

            <div v-else>
                <div class="customer-register-wrp">
                    <hbl-button class="button-secondary" @click.native="toggleLoginForm()">
                        {{ 'Back' }}
                    </hbl-button>

                    <div class="headline headline-5" v-text="'I am not having an account yet'" />

                    <hbl-button v-if="!showRegisterForm" class="button-primary" @click.native="toggleRegisterForm()">
                        {{ 'Register' }}
                    </hbl-button>

                    <customer-register-form v-if="showRegisterForm" v-on:register-success="goToCheckout" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'CustomerLogin',

    data() {
        return {
            showLoginForm: true,
            showRegisterForm: false,
            defaultTab: 0,
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
        goToCheckout: function () {
            this.$router.push({
                name: 'checkout',
            });
        },
    },

    head() {
        return {
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }],
        };
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.customer-register-wrp {
    max-width: $form-max-width;
    margin: 0 auto;
    padding: 20px 0;
    padding-top: 10px;

    .headline {
        margin-bottom: 20px;
    }

    button {
        width: 100%;
        margin-bottom: 20px;
    }
}
</style>
