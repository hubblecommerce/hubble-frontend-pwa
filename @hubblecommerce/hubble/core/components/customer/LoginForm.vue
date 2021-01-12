<template>
    <validation-observer
        v-if="showLoginForm"
        ref="observer"
        v-slot="{ passes }"
        tag="form"
        :class="'login-form'"
        @submit.prevent="passes(submitLoginForm)"
    >
        <div class="headline headline-3" v-text="$t('I already have an account')" />

        <validation-provider
            v-slot="{ errors }"
            name="email"
            rules="required|email"
            mode="eager"
            tag="div"
            class="hbl-input-group input-icon"
        >
            <input
                id="email"
                v-model="form.email"
                type="text"
                name="email"
                value=""
                :class="{ invalid: errors.length > 0 }"
                placeholder=" "
                required
            />

            <label for="email" v-text="$t('Email Address')" />

            <i class="icon icon-mail" />

            <div class="validation-msg" v-text="$t(errors[0])" />
        </validation-provider>

        <validation-provider
            v-slot="{ errors }"
            name="loginPassword"
            rules="required|password:8"
            mode="eager"
            tag="div"
            class="hbl-input-group input-icon"
        >
            <input
                id="loginPassword"
                v-model="form.password"
                type="password"
                name="loginPassword"
                autocomplete="on"
                value=""
                :class="{ invalid: errors.length > 0 }"
                placeholder=" "
                required
            />

            <label for="loginPassword" v-text="$t('Password')" />

            <i class="icon icon-lock" />

            <div class="validation-msg" v-text="$t(errors[0])" />
        </validation-provider>

        <template v-for="error in errors">
            <div class="error-message" v-text="error" />
        </template>

        <div class="pw-reset" @click.prevent="toggleLoginForm" v-text="$t('Reset your Password')" />

        <button class="button-primary" @click.prevent="passes(submitLoginForm)">
            {{ $t('Login') }}
            <material-ripple />
        </button>
    </validation-observer>

    <validation-observer
        v-else-if="!showLoginForm"
        ref="observer"
        v-slot="{ passes }"
        class="password-forgot-form"
        tag="form"
        @submit.prevent="passes(submitForgotPassword)"
    >
        <div class="headline headline-3" v-text="$t('Reset your Password')" />

        <validation-provider
            v-slot="{ errors }"
            name="email"
            rules="required|email"
            mode="passive"
            tag="div"
            class="hbl-input-group input-icon"
        >
            <input
                id="email"
                v-model="form.email"
                type="text"
                name="email"
                value=""
                :class="{ invalid: errors.length > 0 }"
                placeholder=" "
                required
            />

            <label for="email" v-text="$t('Email Address')" />

            <i class="icon icon-mail" />

            <div class="validation-msg" v-text="$t(errors[0])" />
        </validation-provider>

        <template v-for="error in errors">
            <div class="error-message" v-text="error" />
        </template>

        <div class="pw-reset" @click.prevent="toggleLoginForm" v-text="$t('Login')" />

        <button class="button-primary password-forgot-button" @click.prevent="passes(submitForgotPassword)">
            {{ $t('Get new Password') }}
            <material-ripple />
        </button>
    </validation-observer>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import Form from '@hubblecommerce/hubble/core/utils/form';
import { addBackendErrors } from '@hubblecommerce/hubble/core/utils/formMixins';
import _ from 'lodash';

export default {
    name: 'LoginForm',

    mixins: [addBackendErrors],

    data() {
        return {
            form: new Form({
                email: '',
                password: '',
            }),
            errors: [],
            showLoginForm: true,
        };
    },

    computed: {
        ...mapState({
            customer: (state) => state.modApiCustomer.customer,
            wishlistState: (state) => state.modWishlist.wishlistItemsObj,
        }),
    },

    methods: {
        ...mapActions({
            logIn: 'modApiCustomer/logIn',
            getWishlist: 'modApiCustomer/getWishlist',
            updateWishlist: 'modApiCustomer/updateWishlist',
            saveToStore: 'modWishlist/saveToStore',
            passwordForgot: 'modApiCustomer/passwordForgot',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
            flashMessage: 'modFlash/flashMessage',
        }),
        ...mapMutations({
            setWishlistId: 'modWishlist/setWishlistId',
            setWishlistItemsCount: 'modWishlist/setWishlistItemsCount',
            setWishlistItemsObj: 'modWishlist/setWishlistItemsObj',
        }),
        submitLoginForm: function () {
            let validCreds = {
                email: this.form.email,
                password: this.form.password,
            };

            // Clear error messages
            this.errors = [];

            // Post request with login credentials
            this.logIn(validCreds)
                .then(() => {
                    // Get wishlist of current customer from api and save to store
                    this.getWishlist().then((response) => {
                        if (!_.isEmpty(response.data.item)) {
                            // Merge Wishlist of store with existing user wishlist from api
                            let state = _.clone(this.wishlistState);
                            let mergedWishlists = _.merge(state, response.data.item.payload.items);
                            let wishlistId = response.data.item.id;
                            let wishlistQty = Object.keys(mergedWishlists).length;

                            // Save to store
                            this.setWishlistId(wishlistId);
                            this.setWishlistItemsCount(wishlistQty);
                            this.setWishlistItemsObj(mergedWishlists);
                            this.saveToStore();

                            // Update wishlist of api
                            this.updateWishlist({
                                user_id: this.customer.customerData.id,
                                id: wishlistId,
                                wishlist: {
                                    qty: wishlistQty,
                                    items: mergedWishlists,
                                },
                            });
                        }

                        // If current route is checkout, then do redirect to checkout
                        if (this.$router.history.current.path.includes('/checkout')) {
                            if (process.env.API_TYPE === 'sw') {
                                this.$router.push({
                                    path: this.localePath('checkout-overview'),
                                });

                                return;
                            }

                            this.$router.push({
                                path: this.localePath('checkout-payment'),
                            });
                        }

                        // If current route is customer-login, then do redirect to dashboard
                        if (this.$router.history.current.path.includes('/customer/login')) {
                            this.$router.push({
                                path: this.localePath('customer-dashboard'),
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.log('logIn error: ', error);

                    this.errors.push(this.$t('Login failed'));

                    /*_.forEach(this.addBackendErrors(error), error => {
                        this.errors.push(error);
                    });*/
                });
        },
        submitForgotPassword: function () {
            let payload = {
                email: this.form.email,
            };

            this.passwordForgot(payload)
                .then(() => {
                    // close off canvas if in offcanvas and show success message
                    this.hideOffcanvasAction().then(() => {
                        this.flashMessage({
                            flashType: 'success',
                            flashMessage: this.$t(
                                'We send you an email with further instructions to reset your password.'
                            ),
                            keepOnRouteChange: true,
                        });

                        // Reset data
                        this.form = new Form({
                            email: '',
                            password: '',
                        });

                        this.errors = [];
                    });
                })
                .catch(() => {
                    this.errors.push(this.$t('Requesting a new password has failed.'));
                });
        },
        toggleLoginForm: function () {
            this.errors = [];
            this.showLoginForm = !this.showLoginForm;
        },
    },
};
</script>
