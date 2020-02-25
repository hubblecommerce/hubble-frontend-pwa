<template>
    <div class="box order-list">
        <div class="box-title">{{ title }}</div>
        <div v-if="ordersExists()" class="t-wrapper">
            <div class="t-row t-head">
                <div class="t-col">{{ $t('Order') }} #</div>
                <div class="t-col">{{ $t('Date') }}</div>
                <div class="t-col">{{ $t('Total') }}</div>
                <div class="t-col">{{ $t('Status') }}</div>
                <div class="t-col">{{ $t('Action') }}</div>
            </div>
            <div v-for="(order, index) in orders" v-if="index <= limit && orders.length > 0" :key="index" class="t-row">
                <div class="t-col" v-text="'000'+order.id" />
                <div class="t-col" v-text="formatDate(order.createdAt)" />
                <div class="t-col">
                    <span v-if="order.payload" v-text="getTotals(JSON.parse(order.payload))" />
                </div>
                <div class="t-col">{{ $t(order.status_label) }}</div>
                <div class="t-col">
                    <nuxt-link :to="'/customer/order/'+order.id">{{ $t('View Order') }}</nuxt-link>
                </div>
            </div>
        </div>
        <div v-else>{{ $t('No orders yet') }}</div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "CustomerOrderList",

        props: {
            limit: {
                type: Number,
                required: false,
                default: 100
            },
            title: {
                type: String,
                required: false,
                default: ''
            }
        },

        data() {
          return {
              orders: [],
              data: []
          }
        },

        computed: {
            ...mapState({
                priceCurrency: state => state.modPrices.priceCurrency,
                priceCurrencySymbol: state => state.modPrices.priceCurrencySymbol
            })
        },

        mounted() {
            this.getOrders();
        },

        methods: {
            getOrders: function() {
                this.loading = true;

                //Get orders from store
                this.$store.dispatch('modApiPayment/getOrders').then((response) => {
                    this.orders = response;
                }).catch(() => {
                    this.loading = false;
                });
            },
            ordersExists() {
                if(this.orders != null) {
                    if(this.orders.length > 0) {
                        return true;
                    }
                }

                return false;
            },
            getTotals(orderData) {
                if(!_.isEmpty(orderData.cart)) {

                    let total = this.$store.getters['modPrices/priceDecFmt'](orderData.cart.grand_total);
                    total = this.$store.getters['modPrices/priceAddCur'](orderData.cart.grand_total);

                    return total;
                }
            },
            formatDate(date) {
                let dateObj = new Date(date);
                let dd = dateObj.getDate();
                let mm = dateObj.getMonth() + 1;
                let yyyy = dateObj.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd;
                }

                if (mm < 10) {
                    mm = '0' + mm;
                }

                return dd + '.' + mm + '.' + yyyy;
            }
        }
    }
</script>
