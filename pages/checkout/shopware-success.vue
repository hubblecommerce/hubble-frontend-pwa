<template>
    <div class="container checkout-success">
        <div class="checkout-success-wrp">
            <div class="success-msg-wrp">
                <div class="circle-loader" :class="{'load-complete': !loading}">
                    <div v-show="!loading" class="checkmark draw" />
                </div>
                <div class="message headline-3" v-text="$t('Thank you for your order at hubble!')" />
            </div>
            <transition name="fade">
                <div v-if="!loading">
                    <div class="email-info text-center">
                        <span>{{ $t('We have sent you an order confirmation by e-mail') }}</span>
                        <span v-if="!this.isEmpty(currentOrder)">{{ 'at '+currentOrder.orderCustomer.email }}</span>
                    </div>
                    <div v-if="!this.isEmpty(currentOrder)" class="email-info text-center" v-text="$t('Your order number: '+currentOrder.orderNumber)" />
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "Success",

        middleware: [
            'apiLocalization',
            'trackClickPath'
        ],

        layout: 'hubble_express',

        data() {
            return {
                loading: true,
                order: null
            }
        },

        computed: {
            ...mapState({
                offcanvas: state => state.modNavigation.offcanvas,
                swtc: state => state.modCart.swtc,
                currentOrder: state => state.modApiPayment.currentOrder
            })
        },

        created() {
            setTimeout(() => {
                this.loading = false;
            }, 500);
        },

        methods: {
            isEmpty: function(e) {
                return _.isEmpty(e);
            }
        },

        head() {
            return {
                meta: [
                    { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }
                ]
            }
        }
    }
</script>
