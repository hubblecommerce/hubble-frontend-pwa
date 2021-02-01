<template>
    <div class="container expand-content">
        <div class="row overlay-header">
            <button class="button-icon button-close-menu" @click="toggle()">
                <i class="icon icon-x" aria-hidden="true" />

                <material-ripple />
            </button>

            <div class="overlay-headline" v-text="$t('Customer Account')" />
        </div>

        <div class="row content-wrp">
            <div v-if="isLoggedIn && !isGuest" :key="'loggedIn'">
                <customer-account-navigation />
            </div>


            <div v-if="isLoggedIn && isGuest" :key="'isGuest'">
                <div class="link-wrp">
                    <button class="button-primary logout-button" @click.prevent="onClickLogOutGuest()">
                        {{ $t('Quit guest session') }}

                        <material-ripple />
                    </button>
                </div>
            </div>

            <div v-if="!isLoggedIn" :key="'loggedOut'">
                <login-form />

                <div class="register-form">
                    <div class="headline" v-text="$t('I am not having an account yet')" />

                    <div class="subline">{{ $t('Simply create a customer account with us.') }}</div>

                    <button class="button-primary" @click.prevent="showFormRegister">
                        {{ $t('Register') }}
                        <material-ripple />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';

export default {
    name: 'CustomerMenuLayer',

    components: {
        CustomerAccountNavigation: () => import('../customer/CustomerAccountNavigation'),
        LoginForm: () => import('../customer/LoginForm'),
    },

    data() {
        return {
            name: 'CustomerMenu',
        };
    },

    computed: {
        ...mapState({
            customer: (state) => state.modApiCustomer.customer,
        }),
        isLoggedIn: function () {
            if (!_.isEmpty(this.customer.customerAuth)) {
                return this.customer.customerAuth.token;
            }

            return false;
        },
        isGuest: function() {
            if (!_.isEmpty(this.customer.customerAuth)) {
                return this.customer.customerAuth.guest;
            }

            return false;
        }
    },

    methods: {
        ...mapActions({
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
            logOutGuest: 'modApiCustomer/logOutGuest'
        }),
        toggle: function () {
            this.toggleOffcanvasAction({
                component: this.name,
                direction: 'rightLeft',
            });
        },
        hideMenu: function () {
            this.hideOffcanvasAction();
        },
        showFormRegister: function () {
            this.hideMenu();

            this.$router.push({
                path: this.localePath('customer-login'),
                query: { tab: 1 },
            });
        },
        onClickLogOutGuest: function() {
            this.logOutGuest();
        }
    }
};
</script>
