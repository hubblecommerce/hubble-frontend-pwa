<template>
    <div>
        <no-ssr>
            <button v-if="!isOnWishlist" class="button-icon add-to-wishlist" @click="addToWishlist()">
                <span class="hidden-link-name" v-text="$t('Add to wishlist')"></span>
                <i class="icon icon-heart"></i>
                <material-ripple/>
            </button>
            <button v-if="isOnWishlist" class="button-icon remove-from-wishlist" @click="removeFromWishlist()">
                <span class="hidden-link-name" v-text="$t('Remove from wishlist')"></span>
                <i class="icon icon-heart-full"></i>
                <material-ripple/>
            </button>
        </no-ssr>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "AddToWishlist",

        data() {
            return {
                isOnWishlist: false
            }
        },

        props: {
            item: {
                type: Object,
                required: true
            }
        },

        created() {
            this.checkIfOnWishlist();
        },

        computed: {
            ...mapState({
                wishlistState: state => state.modWishlist.wishlistItemsObj,
                wishlistQty: state => state.modWishlist.wishlistItemsCount,
            })
        },

        watch: {
            wishlistQty() {
                this.checkIfOnWishlist();
            }
        },

        methods: {
            addToWishlist: function() {
                this.$store.dispatch('modWishlist/addItem', {
                    item: this.item,
                    qty: 1
                }).then(() => {
                    //this.$store.dispatch('modFlash/flashMessage', {
                    //    flashType: 'success',
                    //    flashMessage: this.$t('Successfully added item to wishlist.')
                    //});
                });
            },
            removeFromWishlist: function() {
                this.$store.dispatch('modWishlist/delItem', {
                    data: this.item
                })
            },
            checkIfOnWishlist: function() {
                if(this.wishlistState[this.item.id]) {
                    this.isOnWishlist = true;
                } else {
                    this.isOnWishlist = false;
                }
            }
        }
    }
</script>
