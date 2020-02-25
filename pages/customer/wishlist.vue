<template>
    <div class="container">
        <client-only>
            <div class="wishlist-wrp">
                <div class="customer-wishlist-wrp">
                    <div v-if="qty > 0" class="headline">
                        <div class="wishlist-headline">
                            <h1 class="">
                                {{ $t('Your wishlist') }}
                            </h1>
                            <span v-text="wishlistItemsLabel()" />
                        </div>
                        <div class="reset-item" @click="resetWishlist()" v-text="$t('Reset wishlist')" />
                    </div>

                    <wishlist-items-list />
                    <button v-if="qty > 0" class="button-secondary shopping-button" @click.prevent="goToIndex()">
                        {{ $t('Keep shopping') }}
                        <material-ripple />
                    </button>

                    <div v-if="qty <= 0" class="empty-cart">
                        <i class="icon icon-heart" />
                        <div class="headline-1" v-text="$t('Your shopping wishlist is empty')" />
                        <nuxt-link :to="localePath('index')">
                            <button class="button-primary">
                                {{ $t('Discover our products') }}
                                <material-ripple />
                            </button>
                        </nuxt-link>
                    </div>
                </div>
                <div v-if="$mq === 'lg'" class="newsletter-container">
                    <newsletter-form :title="$t('Newsletter registration')"
                                     form-title="Newaletter Abonnieren"
                    />
                </div>
            </div>
        </client-only>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import WishlistItemsList from "../../components/customer/WishlistItemsList";
    import NewsletterForm from "../../components/utils/NewsletterForm";

    export default {
        name: "Wishlist",

        components: {WishlistItemsList, NewsletterForm},

        layout: 'hubble',

        data() {
            return {
                curComponent: 'view-auth'
            }
        },

        computed: {
            ...mapState({
                customer: state => state.modApiCustomer.customer,
                qty: state => state.modWishlist.wishlistItemsCount,
                wishlistId: state => state.modWishlist.wishlistId
            }),
            customerData() {
                return this.customer.customerData;
            },
            customerAddresses() {
                return this.customer.customerAddresses;
            }
        },

        middleware: [
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],

        methods: {
            resetWishlist: function () {
                if(this.isLoggedIn()) {
                    this.$store.dispatch('modApiPayment/deleteWishlist', {
                        user_id: this.customer.customerData.id,
                        id: this.wishlistId
                    }).then(() => {
                        this.$store.dispatch('modWishlist/deleteWishlist');
                    })
                } else {
                    this.$store.dispatch('modWishlist/deleteWishlist');
                }
            },
            isLoggedIn: function() {
                if(!_.isEmpty(this.customer.customerAuth) && this.customer.customerAuth.token !== 'guest') {
                    return this.customer.customerAuth.token;
                }

                return false;
            },
            wishlistItemsLabel: function() {
                return this.qty > 1 ? this.qty + ' ' + this.$t('wishlist_label_items') : this.qty + ' ' + this.$t('wishlist_label_items');
            },
            goToIndex: function () {
                this.$router.push({
                    path: this.localePath('index')
                })
            }
        },

        head() {
            return {
                title: this.$t('Your wishlist'),
                meta: [
                    { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }
                ]
            }
        }
    }
</script>
