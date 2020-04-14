<template>
    <div class="box order-list">
        <div class="box-title">{{ title }}</div>

        <div v-if="ordersExists()" class="t-wrapper">
            <div class="t-row t-head">
                <div class="t-col">{{ $t('Order') }} #</div>
                <div class="t-col">{{ $t('Date') }}</div>
                <div class="t-col">{{ $t('Total') }}</div>
                <div class="t-col">{{ $t('Status') }}</div>
                <div v-if="orders[0].payload != null" class="t-col">{{ $t('Action') }}</div>
            </div>

            <div v-for="(order, index) in orders" :key="index" v-if="index <= limit && orders.length > 0" class="t-row">
                <!-- Show shopware order number if isset  -->
                <div v-if="order.orderNumber != null" class="t-col" v-text="order.orderNumber" />

                <div v-else class="t-col" v-text="'000'+order.id" />

                <div class="t-col" v-text="formatDate(order.createdAt)" />

                <div class="t-col">
                    <!-- Show shopware order totals if isset  -->
                    <span v-if="order.totals != null" v-text="getTotals(order.totals)" />
                    <span v-if="order.payload != null" v-text="getTotals(JSON.parse(order.payload.cart.grand_total))" />
                </div>

                <div class="t-col">{{ $t(order.status_label) }}</div>

                <!-- Shopware: do not show link to order detail page, because /customer/order endpoint doesnt provide cart and adress data -->
                <div v-if="order.payload != null" class="t-col">
                    <nuxt-link :to="'/customer/order/'+order.id">{{ $t('View Order') }}</nuxt-link>
                </div>
            </div>
        </div>

        <div v-else-if="loading" class="loader lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
        </div>

        <div v-else>{{ $t('No orders yet') }}</div>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters } from 'vuex';

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
              loading: false,
              orders: [],
              data: []
          }
        },

        computed: {
            ...mapState({
                priceCurrency: state => state.modPrices.priceCurrency,
                priceCurrencySymbol: state => state.modPrices.priceCurrencySymbol
            }),
            ...mapGetters({
                priceDecFmt: 'modPrices/priceDecFmt',
                priceAddCur: 'modPrices/priceAddCur'
            })
        },

        mounted() {
            this.getOrders();
        },

        methods: {
            ...mapActions({
                getOrdersFromStore: 'modApiCustomer/getOrders'
            }),
            getOrders: function() {
                this.loading = true;

                //Get orders from store
                this.getOrdersFromStore().then((response) => {
                    this.orders = response;

                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
            },
            ordersExists: function() {
                if(this.orders != null) {
                    if(this.orders.length > 0) {
                        return true;
                    }
                }

                return false;
            },
            getTotals: function(value) {
                let total = this.priceDecFmt(value);
                total = this.priceAddCur(value);

                return total;
            },
            formatDate: function(date) {
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
