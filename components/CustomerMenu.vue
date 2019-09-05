<template>
    <div class="customer-account-cpt-wrp" >
        <button class="button-icon" @click='toggle()' v-bind:class="setButtonStates">
            <i class="icon icon-account"></i><span class="hidden-link-name">Account</span>
            <material-ripple></material-ripple>
        </button>
        <transition-expand-layer :rightLeft="true">
            <div v-if="showMenu" class="transition-expand-wrp">
                <div class="container expand-content">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-close" aria-hidden="true"></i>
                            <material-ripple></material-ripple>
                        </button>
                        <div class="overlay-headline" v-text="$t('Customer Account')"></div>
                    </div>
                    <div class="row content-wrp">
                        <template v-if="isLoggedIn">
                            <customer-account-navigation></customer-account-navigation>
                            <button class="button-primary" @click.prevent="attemptLogout">
                                Logout
                                <material-ripple></material-ripple>
                            </button>
                        </template>
                        <template v-else>
                            <div class="headline" v-text="$t('I already have an account')"></div>
                            <login-form/>

                            <div class="headline" v-text="$t('I am not having an account yet')"></div>
                            <div class="subline">Erstellen Sie ganz einfach ein Kundenkonto bei uns.</div>
                            <button class="button-primary" @click.prevent="showFormRegister">
                                {{$t('Register')}}
                                <material-ripple></material-ripple>
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import CustomerAccountNavigation from "./CustomerAccountNavigation";

export default {
    components: {CustomerAccountNavigation},

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
            authUser: state => state.modUser.authUser,
            isLoggedIn: state => state.modUser.isLoggedIn,
            offcanvas: state => state.modNavigation.offcanvas
        }),
        setButtonStates: function() {
            return {
                active: this.showMenu
            }
        },
        showMenu: function() {
            if(this.offcanvas.component === this.name) {
                return true;
            }

            return false;
        }
    },

    methods: {
        toggle() {
            this.$store.dispatch('modNavigation/toggleOffcanvasAction', {
                component: this.name,
                direction: 'rightLeft'
            });
        },
        hideMenu: function() {
            this.$store.dispatch('modNavigation/hideOffcanvasAction');
        },
        showFormRegister: function() {
            this.hideMenu();

            this.$router.push({
                path: this.localePath('customer-register')
            });
        },
        attemptLogout() {
            console.log("attemptLogout ...");

            this.$store.dispatch('modUser/attemptLogout')
            .then(response => {
                console.log("attemptLogout ... backend response success: %o", response);

                this.hideMenu();

                this.$router.push({
                    path: this.localePath('customer-login')
                });
            })
            .catch(response => {
                console.log("attemptLogout ... backend response success: %o", response);
            })
        }
    },

    watch: {
        '$route.path': function() {
            // Close menu layer if route changes
            this.hideMenu();
        }
    },
}
</script>
