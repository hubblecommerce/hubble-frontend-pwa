<template>
    <div class="main-container">
        <div class="container customer-dashboard customer-orders">
            <div class="row">
                <div v-if="$mq === 'md' || $mq === 'lg'" class="col-sm-12 col-md-3 sidebar-wrp">
                    <customer-account-navigation />
                </div>
                <div class="col-sm-12 col-md-9 content-wrp">
                    <div class="row">
                        <div class="col-md-12">
                            <customer-order-list :title="$t('All Orders')" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CustomerAccountNavigation from "../../components/customer/CustomerAccountNavigation";
    import CustomerOrderList from "../../components/customer/CustomerOrderList";

    export default {
        name: 'CustomerDashboard',

        components: {CustomerOrderList, CustomerAccountNavigation},

        layout: 'hubble',

        middleware: [
            'apiAuthenticate',
            'apiPaymentAuthenticate',
            'apiCustomerAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],

        head() {
            return {
                title: this.$t('Customer Account Dashboard'),
                meta: [
                    { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }
                ]
            }
        }
    }
</script>
