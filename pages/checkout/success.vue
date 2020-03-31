<template>
    <div class="container checkout-success">
        <div class="checkout-success-wrp">
            <div class="success-msg-wrp">
                <div class="circle-loader" :class="{'load-complete': !loading}">
                    <div v-show="!loading" class="checkmark draw" />
                </div>
                <div class="message headline-3" v-text="$t('Thank you for your order at hubble!')" />
            </div>
            <div class="email-info text-small" v-text="$t('We have sent you an order confirmation by e-mail.')" />
            <nuxt-link :to="localePath('index')">
                <button class="button-secondary" v-text="$t('Back to shop')" />
            </nuxt-link>
            <order-detail v-if="order !== null && !isGuest" :order="order" />
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import OrderDetail from "../../components/customer/OrderDetail";
    export default {
        name: "Success",

        components: {OrderDetail},

        middleware: [
            'apiPaymentAuthenticate',
            'apiCustomerAuthenticate',
            'successValidate',
            'apiLocalization',
            'trackClickPath'
        ],

        layout: 'hubble_light',

        data() {
            return {
                loading: true,
                order: null
            }
        },

        computed: {
            ...mapState({
                customer: state => state.modApiPayment.customer,
                offcanvas: state => state.modNavigation.offcanvas,
                cookieName: state => state.modApiPayment.cookieName,
                cookieNameAddress: state => state.modApiPayment.cookieNameAddress,
            }),
            isGuest: function() {
                return this.customer.customerAuth.token === 'guest';
            },
        },

        created() {
            setTimeout(() => {
                this.loading = false;
            }, 500);
        },

        mounted() {
            if(!this.isGuest) {
                this.getLatestOrder();
            }

            if(this.isGuest) {
                // Guest only: Delete customer auth cookie
                if(this.customer.customerAuth.token === 'guest') {
                    // Remove cookies
                    this.$cookies.remove(this.cookieName);
                    this.$cookies.remove(this.cookieNameAddress);
                }
            }
        },

        methods: {
            ...mapActions({
                getOrders: 'modApiPayment/getOrders'
            }),
            getLatestOrder: function() {
                let latestDate = new Date(0);
                let latestOrder = {};

                // Get orders from customer
                this.getOrders().then((res) => {

                    if(res !== null) {
                        _.forEach(res, (val) => {
                            let date = new Date(val.createdAt);
                            if(date.getTime() > latestDate.getTime()) {
                                latestDate = date;
                                latestOrder = val;
                            }
                        });
                    }
                    this.order = latestOrder;
                });
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
