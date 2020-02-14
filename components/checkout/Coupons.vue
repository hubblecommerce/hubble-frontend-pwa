<template>
    <div class="coupons-wrp">
        <div class="coupon-title headline-3" v-text="$t('Voucher / Coupon')" />
        <div class="text-small subline" v-text="$t('Did you receive a discount coupon or coupon?')" />
        <div class="hbl-input-group">
            <input id="coupon-code" v-model="couponCode" type="text" placeholder=" " required>
            <label for="coupon-code" v-text="$t('Code')" />
        </div>
        <button class="button-secondary shopping-button" :disabled="loading" @click="applyCoupon()">
            <span v-if="!loading">{{ $t('Apply voucher') }}</span>
            <div v-if="loading" class="loader lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
            </div>
            <material-ripple />
        </button>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "Coupons",

        data() {
            return {
                couponCode: null,
                loading: false
            }
        },

        computed: {
            ...mapState({
                cart: state => state.modCart.cart,
                qty: state => state.modCart.cart.items_qty,
            })
        },

        methods: {
            applyCoupon: function() {

                this.$store.dispatch('modCart/checkCouponInCart', this.couponCode).then(() => {

                    // Start loading
                    this.loading = true;

                    this.$store.dispatch('modApiPayment/applyCoupon', {
                        cart: JSON.stringify(this.cart),
                        coupon: this.couponCode
                    }).then((response) => {

                        // End loading
                        this.loading = false;

                        this.$store.dispatch('modCart/storeCouponToCart', response).then(() => {
                            this.$store.dispatch('modFlash/flashMessage', {
                                flashType: 'success',
                                flashMessage: this.$t('Coupon applied successfully: ') + this.couponCode
                            });
                        });

                    }).catch((errorMessage) => {

                        // End loading
                        this.loading = false;

                        this.$store.dispatch('modFlash/flashMessage', {
                            flashType: 'error',
                            flashMessage: this.$t(errorMessage)
                        });
                    });

                }).catch((error) => {
                    this.$store.dispatch('modFlash/flashMessage', {
                        flashType: 'error',
                        flashMessage: this.$t(error)
                    });
                });

            }
        }
    }
</script>
