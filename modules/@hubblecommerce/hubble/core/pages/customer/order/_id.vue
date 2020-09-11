<template>
    <div class="main-container">
        <div class="container customer-dashboard order-detail">
            <div class="row">
                <div v-if="$mq === 'md' || $mq === 'lg'" class="col-sm-12 col-md-3 sidebar-wrp">
                    <customer-account-navigation />
                </div>
                <div class="col-sm-12 col-md-9 content-wrp">
                    <order-detail v-if="order !== null" :order="order" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import CustomerAccountNavigation from '../../../components/customer/CustomerAccountNavigation';
import OrderDetail from '../../../components/customer/OrderDetail';
import apiCustomerAuthenticate from '@hubblecommerce/hubble/core/anonymous-middleware/apiCustomerAuthenticate';
import apiPaymentAuthenticate from '@hubblecommerce/hubble/core/anonymous-middleware/apiPaymentAuthenticate';

export default {
    components: { OrderDetail, CustomerAccountNavigation },

    layout: 'hubble',

    middleware: ['apiLocalization', 'apiAuthenticate', apiPaymentAuthenticate, apiCustomerAuthenticate, 'apiResourceMenu', 'trackClickPath'],

    data() {
        return {
            id: this.$route.params.id,
            order: null,
        };
    },

    mounted() {
        this.getCurrentOrder();
    },

    methods: {
        ...mapActions({
            getOrderById: 'modApiPayment/getOrderById',
        }),
        getCurrentOrder() {
            // Get order from customer by id from url /orders/:id
            this.getOrderById({ id: this.id }).then(res => {
                this.order = res.data.item;
            });
        },
    },

    head() {
        return {
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }],
        };
    },
};
</script>
