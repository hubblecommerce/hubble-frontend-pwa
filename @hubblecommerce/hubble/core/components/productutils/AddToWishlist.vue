<template>
    <div class="add-to-wishlist-wrp">
        <client-only>
            <transition name="fade">
                <button v-if="!isOnWishlist" class="button-icon add-to-wishlist" @click="addToWishlist()">
                    <span class="hidden-link-name" v-text="$t('Add to wishlist')" />

                    <i class="icon icon-heart" />

                    <material-ripple />
                </button>

                <button v-if="isOnWishlist" class="button-icon remove-from-wishlist" @click="removeFromWishlist()">
                    <span class="hidden-link-name" v-text="$t('Remove from wishlist')" />

                    <i class="icon icon-heart-filled" />

                    <material-ripple />
                </button>
            </transition>
        </client-only>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import _ from 'lodash';

export default {
    name: 'AddToWishlist',

    props: {
        item: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            isOnWishlist: false,
        };
    },

    computed: {
        ...mapState({
            wishlistState: state => state.modWishlist.wishlistItemsObj,
            wishlistId: state => state.modWishlist.wishlistId,
            wishlistQty: state => state.modWishlist.wishlistItemsCount,
            selectedVariants: state => state.modApiResources.selectedVariants,
            customer: state => state.modApiCustomer.customer,
        }),
    },

    watch: {
        wishlistQty() {
            this.checkIfOnWishlist();
        },
    },

    created() {
        this.checkIfOnWishlist();
    },

    methods: {
        ...mapActions({
            postWishlist: 'modApiCustomer/postWishlist',
            updateWishlist: 'modApiCustomer/updateWishlist',
            deleteCustomerWishlist: 'modApiCustomer/deleteWishlist',
            deleteWishlist: 'modWishlist/deleteWishlist',
            delItem: 'modWishlist/delItem',
            addItem: 'modWishlist/addItem',
            saveToStore: 'modWishlist/saveToStore',
            flashMessage: 'modFlash/flashMessage',
        }),
        ...mapMutations({
            setWishlistId: 'modWishlist/setWishlistId',
        }),
        addToWishlist: function () {
            this.addItem({
                item: this.item,
                qty: 1,
            }).then(() => {
                // Save wishlist to api
                if (this.isLoggedIn()) {
                    // Get wishlist of customer on every login and save to store
                    // if no wishlist id isset in store that means there is no existing wishlist
                    // in this case do a POST to create a new wishlist
                    // ELSE: there is a existing wishlist, so just update it via PUT and ID
                    if (!this.wishlistId) {
                        this.postWishlist({
                            user_id: this.customer.customerData.id,
                            wishlist: {
                                qty: this.wishlistQty,
                                items: this.wishlistState,
                            },
                        }).then(response => {
                            // If no wishlist exists get newly created wishlist id and save to store
                            if (!this.wishlistId) {
                                this.setWishlistId(response.data.item.id);
                                this.saveToStore();
                            }
                        });
                    } else {
                        this.updateWishlist({
                            user_id: this.customer.customerData.id,
                            id: this.wishlistId,
                            wishlist: {
                                qty: this.wishlistQty,
                                items: this.wishlistState,
                            },
                        });
                    }
                }

                // Display Success Message
                this.flashMessage({
                    flashType: 'info',
                    flashMessage: this.$t('Successfully added item to wishlist.'),
                });
            });
        },
        removeFromWishlist: function () {
            // Remove wishlist completely from store
            // Delete wishlist as well from api if customer is logged in
            // ELSE: Just remove item from wishlist and update wishlist to api if user is logged in
            if (this.wishlistQty === 1) {
                if (this.isLoggedIn()) {
                    this.deleteCustomerWishlist({
                        user_id: this.customer.customerData.id,
                        id: this.wishlistId,
                    }).then(() => {
                        this.deleteWishlist();

                        // Display Success Message
                        this.flashMessage({
                            flashType: 'info',
                            flashMessage: this.$t('Removed item from wishlist.'),
                        });
                    });
                } else {
                    this.deleteWishlist();

                    // Display Success Message
                    this.flashMessage({
                        flashType: 'info',
                        flashMessage: this.$t('Removed item from wishlist.'),
                    });
                }
            } else {
                this.delItem({
                    data: this.item,
                }).then(() => {
                    // Update wishlist via api
                    if (this.isLoggedIn()) {
                        this.updateWishlist({
                            user_id: this.customer.customerData.id,
                            id: this.wishlistId,
                            wishlist: {
                                qty: this.wishlistQty,
                                items: this.wishlistState,
                            },
                        });
                    }

                    // Display Success Message
                    this.flashMessage({
                        flashType: 'info',
                        flashMessage: this.$t('Removed item from wishlist.'),
                    });
                });
            }
        },
        checkIfOnWishlist: function () {
            this.isOnWishlist = !!this.wishlistState[this.item.id];
        },
        isLoggedIn: function () {
            if (!_.isEmpty(this.customer.customerAuth) && this.customer.customerAuth.token !== 'guest') {
                return this.customer.customerAuth.token;
            }

            return false;
        },
    },
};
</script>
