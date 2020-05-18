<template>
    <div class="customer-account-cpt-wrp">
        <button class="button-icon"
                :class="setButtonStates"
                @click="toggle()"
        >
            <i class="icon icon-account" /><span class="hidden-link-name">Account</span>

            <material-ripple />
        </button>
        <transition-expand-layer :right-left="true">
            <div v-if="showMenu" class="transition-expand-wrp">
                <div class="container expand-content">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-close" aria-hidden="true" />

                            <material-ripple />
                        </button>

                        <div class="overlay-headline" v-text="$t('Customer Account')" />
                    </div>

                    <div class="row content-wrp">
                        <transition name="fade" mode="out-in">
                            <div v-if="isLoggedIn" :key="'loggedIn'">
                                <customer-account-navigation />
                            </div>

                            <div v-if="!isLoggedIn" :key="'loggedOut'">
                                <login-form />

                                <div class="headline" v-text="$t('I am not having an account yet')" />

                                <div class="subline">{{ $t('Simply create a customer account with us.') }}</div>

                                <button class="button-primary" @click.prevent="showFormRegister">
                                    {{ $t('Register') }}
                                    <material-ripple />
                                </button>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CustomerAccountNavigation from "../customer/CustomerAccountNavigation";
import LoginForm from "../customer/LoginForm";

export default {
    name: 'CustomerMenu',

    components: {LoginForm, CustomerAccountNavigation},

    data() {
        return {
            name: 'CustomerMenu',
            displayMenu: false,
            loginUsername: '',
            loginPassword: ''
        }
    },

    computed: {
        ...mapState({
            customer: state => state.modApiCustomer.customer,
            offcanvas: state => state.modNavigation.offcanvas
        }),
        setButtonStates: function() {
            return {
                active: this.showMenu
            }
        },
        showMenu: function() {
            return this.offcanvas.component === this.name;
        },
        isLoggedIn: function() {
            if(!_.isEmpty(this.customer.customerAuth) && this.customer.customerAuth.token !== 'guest') {
                return this.customer.customerAuth.token;
            }

            return false;
        }
    },

    watch: {
        '$route.path': function() {
            // Close menu layer if route changes
            this.hideMenu();
        }
    },

    methods: {
        ...mapActions({
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction'
        }),
        toggle: function() {
            this.toggleOffcanvasAction({
                component: this.name,
                direction: 'rightLeft'
            });
        },
        hideMenu: function() {
            this.hideOffcanvasAction();
        },
        showFormRegister: function() {
            this.hideMenu();

            this.$router.push({
                path: this.localePath('customer-login'),
                query: { tab: 1 }
            });
        }
    }
}
</script>
