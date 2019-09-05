<template>
    <div class="box elevation-2">
        <div class="box-title">{{ $t('Recent Orders') }}</div>
        <div class="t-wrapper" v-if="ordersExists()">
            <div class="t-row t-head">
                <div class="t-col">{{ $t('Order') }} #</div>
                <div class="t-col">{{ $t('Date') }}</div>
                <div class="t-col">{{ $t('Total') }}</div>
                <div class="t-col">{{ $t('Status') }}</div>
                <div class="t-col">{{ $t('Action') }}</div>
            </div>
            <div v-for="(order, index) in orders" :key="index" v-if="index <= limit" class="t-row">
                <div class="t-col" v-text="'000000001'+index"></div>
                <div class="t-col" v-text="formatDate(order.date)"></div>
                <div class="t-col" v-text="formatPrice(order.total)"></div>
                <div class="t-col">{{$t(order.state)}}</div>
                <div class="t-col"><nuxt-link :to="'/order/'+order.id">{{ $t('View Order') }}</nuxt-link></div>
            </div>
        </div>
        <div v-else >{{ $t('No orders yet') }}</div>
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
            }
        },
        computed: {
            ...mapState({
                orders: state => state.modUser.authUser.customerOrders,
                priceCurrency: state => state.modPrices.priceCurrency,
                priceCurrencySymbol: state => state.modPrices.priceCurrencySymbol
            })
        },
        methods: {
            ordersExists() {
                if(this.orders != null) {
                    if(this.orders.length > 0) {
                        return true;
                    }
                }

                return false;
            },
            formatPrice(price) {
                return price + ' ' + this.priceCurrencySymbol;
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
