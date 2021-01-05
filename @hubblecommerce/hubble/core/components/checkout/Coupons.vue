<template>
    <div class="coupons-wrp">
        <div class="coupon-title headline-3" v-text="$t('Voucher / Coupon')" />

        <div class="text-small subline" v-text="$t('Did you receive a discount coupon or coupon?')" />

        <div class="hbl-input-group">
            <input id="coupon-code" v-model="couponCode" type="text" placeholder=" " required />
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
import { mapState, mapActions } from 'vuex';
export default {
    name: 'Coupons',

    data() {
        return {
            couponCode: null,
            loading: false,
        };
    },

    computed: {
        ...mapState({
            cart: (state) => state.modCart.cart,
            qty: (state) => state.modCart.cart.items_qty,
        }),
    },

    methods: {
        ...mapActions({
            checkCouponInCart: 'modCart/checkCouponInCart',
            applyCouponAction: 'modApiPayment/applyCoupon',
            storeCouponToCart: 'modCart/storeCouponToCart',
            flashMessage: 'modFlash/flashMessage',
        }),
        applyCoupon: function () {
            this.checkCouponInCart(this.couponCode)
                .then(() => {
                    // Start loading
                    this.loading = true;

                    this.applyCouponAction({
                        cart: JSON.stringify(this.cart),
                        coupon: this.couponCode,
                    })
                        .then((response) => {
                            // End loading
                            this.loading = false;

                            this.storeCouponToCart(response).then(() => {
                                this.flashMessage({
                                    flashType: 'success',
                                    flashMessage: this.$t('Coupon applied successfully: ') + this.couponCode,
                                });
                            });
                        })
                        .catch((errorMessage) => {
                            // End loading
                            this.loading = false;

                            this.flashMessage({
                                flashType: 'error',
                                flashMessage: this.$t(errorMessage),
                            });
                        });
                })
                .catch((error) => {
                    this.flashMessage({
                        flashType: 'error',
                        flashMessage: this.$t(error),
                    });
                });
        },
    },
};
</script>
