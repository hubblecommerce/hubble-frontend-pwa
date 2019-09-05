<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="success-wrp md-elevation-2">
                    <transition name="fade">
                        <div class="content-wrp" v-if="isLoading">
                            <div class="status-text">{{ $t('Your order is processing') }}</div>
                            <div class="lds-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </transition>

                    <transition name="fade">
                        <div class="content-wrp" v-if="!isLoading">
                            <div class="status-text">{{ $t('Thank you for shopping!') }}</div>
                            <i class="icon rct-3x rct-check text-success"></i>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {

        name: 'CheckoutCartPayment',

        middleware: [
            // 'authRequired',
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],

        layout: 'hubble',

        data() {
            return {
                isLoading: true
            }
        },

        computed: {
            ...mapState({
                items: state => state.modCart.cartItemsObj,
                qty: state => state.modCart.cartItemsCount
            }),
        },

        methods: {
            showSuccess() {
                this.$store.dispatch('modCart/clearAll', {})
                .then(response => {
                    this.isLoading = false;
                });
            }
        },

        created() {
            //
            // => middleware protection required
            //
            if(this.qty < 1) {
                this.$router.push({
                    path: '/checkout/cart'
                });

                return;
            }

            setTimeout(() => {
                this.showSuccess();
            }, 3000);
        }
    }
</script>
