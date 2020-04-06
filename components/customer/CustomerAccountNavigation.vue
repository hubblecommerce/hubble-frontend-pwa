<template>
    <div class="link-wrp">
        <nuxt-link :to="localePath('customer-dashboard')" class="sidebar-link">
            <button class="button-secondary">
                {{ $t('Customer Dashboard') }}
                <material-ripple />
            </button>
        </nuxt-link>
        <nuxt-link :to="localePath('customer-orders')" class="sidebar-link">
            <button class="button-secondary">
                {{ $t('My Orders') }}
                <material-ripple />
            </button>
        </nuxt-link>
        <nuxt-link :to="localePath('customer-addresses')" class="sidebar-link">
            <button class="button-secondary">
                {{ $t('Customer Addresses') }}
                <material-ripple />
            </button>
        </nuxt-link>
        <button class="button-primary logout-button" @click.prevent="attemptLogout">
            {{ $t('Logout') }}
            <material-ripple />
        </button>
    </div>
</template>

<script>
    import { mapActions} from 'vuex';
    export default {
        name: "CustomerAccountNavigation",
        methods: {
            ...mapActions({
                logOut: 'modApiCustomer/logOut',
                deleteWishlist: 'modWishlist/deleteWishlist',
                flashMessage: 'modFlash/flashMessage',
                hideOffcanvasAction: 'modNavigation/hideOffcanvasAction'
            }),
            attemptLogout() {
                let msg = this.$t('Successfully logged out');
                this.logOut().then(() => {
                        // Clear wishlist from store
                        this.deleteWishlist();

                        // Close offcanvas
                        this.hideMenu();

                        // Flash Message on same page and after redirect
                        if(_.includes(this.$router.currentRoute.path, '/customer')) {
                            this.$router.push({
                                path: '/customer/login'
                            }, () => {
                                this.flashMessage({
                                    flashType: 'success',
                                    flashMessage: msg,
                                    keepOnRouteChange: true
                                })
                            }, () => {
                                this.flashMessage({
                                    flashType: 'success',
                                    flashMessage: msg
                                });
                            });
                        } else {
                            this.flashMessage({
                                flashType: 'success',
                                flashMessage: msg
                            })
                        }
                    })
                    .catch(() => {
                        msg = this.$t('Logout failed');
                        this.flashMessage({
                            flashType: 'error',
                            flashMessage: msg
                        })
                    })
            },
            hideMenu: function() {
                this.hideOffcanvasAction();
            }
        }
    }
</script>
