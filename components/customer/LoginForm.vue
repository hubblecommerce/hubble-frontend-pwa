<template>
    <validation-observer v-if="showLoginForm" ref="observer" v-slot="{ passes }" tag="form" @submit.prevent="passes(submitLoginForm)">
        <div class="headline headline-3" v-text="$t('I already have an account')" />
        <validation-provider v-slot="{ errors }" name="email" rules="required" mode="passive" tag="div" class="hbl-input-group input-icon">
                <input id="email"
                       v-model="form.email"
                       type="text" name="email"
                       value=""
                       :class="{invalid: errors.length > 0}"
                       placeholder=" "
                       required
                >
                <label for="email" v-text="$t('Email Address')" />
                <i class="icon icon-mail" />
                <div class="validation-msg" v-text="$t(errors[0])" />
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="password" rules="required" mode="passive" tag="div" class="hbl-input-group input-icon">
            <input id="password"
                   v-model="form.password"
                   type="password" name="password"
                   autocomplete="on" value=""
                   :class="{invalid: errors.length > 0}"
                   placeholder=" "
                   required
            >
            <label for="password" v-text="$t('Password')" />
            <i class="icon icon-lock" />
            <div class="validation-msg" v-text="$t(errors[0])" />
        </validation-provider>

        <div class="error-message" v-text="error" />

        <div class="pw-reset" @click.prevent="toggleLoginForm" v-text="$t('Reset your Password')" />

        <button class="button-primary" @click.prevent="passes(submitLoginForm)">
            {{ $t('Login') }}
            <material-ripple />
        </button>
    </validation-observer>

    <validation-observer v-else-if="!showLoginForm" ref="observer" v-slot="{ passes }" class="password-forgot-form" tag="form" @submit.prevent="passes(submitForgotPassword)">
        <div class="headline headline-3" v-text="$t('Reset your Password')" />
        <validation-provider v-slot="{ errors }" name="email" rules="required|email" mode="passive" tag="div" class="hbl-input-group input-icon">
            <input id="email"
                   v-model="form.email"
                   type="text" name="email"
                   value=""
                   :class="{invalid: errors.length > 0}"
                   placeholder=" "
                   required
            >
            <label for="email" v-text="$t('Email Address')" />
            <i class="icon icon-mail" />
            <div class="validation-msg" v-text="$t(errors[0])" />
        </validation-provider>

        <div class="error-message" v-text="error" />

        <div class="pw-reset" @click.prevent="toggleLoginForm" v-text="$t('Login')" />

        <button class="button-primary password-forgot-button" @click.prevent="passes(submitForgotPassword)">
            {{ $t('Get new Password') }}
            <material-ripple />
        </button>
    </validation-observer>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import Form from '@hubblecommerce/hubble/core/utils/form';
    import {addBackendErrors} from "@hubblecommerce/hubble/core/utils/formMixins";

    export default {
        name: "LoginForm",

        mixins: [addBackendErrors],

        data() {
            return {
                curComponent: 'view-auth',

                form: new Form({
                    email: '',
                    password: ''
                }),

                error: null,

                showLoginForm: true,
            }
        },

        computed: {
            ...mapState({
                customer: state => state.modApiCustomer.customer,
                wishlistState: state => state.modWishlist.wishlistItemsObj
            }),
        },

        methods: {
            ...mapActions({
                logIn: 'modApiCustomer/logIn',
                getWishlist: 'modApiCustomer/getWishlist',
                updateWishlist: 'modApiCustomer/updateWishlist',
            }),
            submitLoginForm: function() {
                let validCreds = {
                    email: this.form.email,
                    password: this.form.password
                };

                // Clear error messages
                this.error = null;

                // Post request with login credentials
                this.logIn(validCreds).then((response) => {

                    // Get wishlist of current customer from api and save to store
                    this.getWishlist().then(response => {

                        if(!_.isEmpty(response.data.item)) {
                            // Merge Wishlist of store with existing user wishlist from api
                            let state = _.clone(this.wishlistState);
                            let mergedWishlists = _.merge(state, response.data.item.payload.items);
                            let wishlistId = response.data.item.id;
                            let wishlistQty = Object.keys(mergedWishlists).length;

                            // Save to store
                            this.$store.commit('modWishlist/setWishlistId', wishlistId);
                            this.$store.commit('modWishlist/setWishlistItemsCount', wishlistQty);
                            this.$store.commit('modWishlist/setWishlistItemsObj', mergedWishlists);
                            this.$store.dispatch('modWishlist/saveToStore');

                            // Update wishlist of api
                            this.updateWishlist({
                                user_id: this.customer.customerData.id,
                                id: wishlistId,
                                wishlist: {
                                    qty: wishlistQty,
                                    items: mergedWishlists
                                }
                            });
                        }

                        // If current route is checkout, then do redirect to checkout
                        if(this.$router.history.current.path.includes('/checkout')) {
                            if(process.env.API_TYPE === 'sw') {
                                this.$router.push({
                                    path: this.localePath('checkout-shopware-onepage')
                                });
                                return;
                            }

                            this.$router.push({
                                path: this.localePath('checkout-payment')
                            });
                        }

                        // If current route is customer-login, then do redirect to dashboard
                        if(this.$router.history.current.path.includes('/customer/login')) {
                            this.$router.push({
                                path: this.localePath('customer-dashboard')
                            });
                        }
                    })

                }).catch((error) => {
                    // Show api request error
                    this.addBackendErrors(error.errors);
                    this.error = this.$t('Login failed');
                });
            },
            submitForgotPassword: function () {
                let payload = {
                    email: this.form.email
                };

                this.$store.dispatch('modApiCustomer/passwordForgot', payload).then(response => {
                    // close off canvas if in offcanvas and show success message
                    this.$store.dispatch('modNavigation/hideOffcanvasAction').then(()=> {
                        this.$store.dispatch('modFlash/flashMessage', {
                            flashType: 'success',
                            flashMessage: 'Ihnen wurde ein neues Passwort an Ihre E-Mail Adresse gesendet.',
                            keepOnRouteChange: true
                        });

                        // Reset data
                        this.form = new Form({
                            email: '',
                            password: ''
                        });
                        this.error = '';
                    });
                }).catch(error => {
                    this.error = 'Neues Password anfordern fehlgeschlagen';
                    //console.log(error);
                });
            },
            toggleLoginForm: function () {
                this.showLoginForm = !this.showLoginForm;
            }
        },

    }
</script>
