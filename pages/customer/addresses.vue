<template>
    <div class="main-container">
        <div class="container customer-dashboard customer-addresses">
            <div class="row">
                <div v-if="$mq === 'md' || $mq === 'lg'" class="col-sm-12 col-md-3 sidebar-wrp">
                    <customer-account-navigation />
                </div>
                <div class="col-sm-12 col-md-9 content-wrp">
                    <div class="row">
                        <div class="col-md-12 headline-wrp">
                            <div class="title">
                                {{ $t('Customer Addresses') }}
                            </div>
                        </div>
                    </div>
                    <customer-addresses :show-all-addresses="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CustomerAccountNavigation from "../../components/customer/CustomerAccountNavigation";
    import CustomerAddresses from "../../components/customer/CustomerAddresses";
    import apiCustomerAuthenticate from '@hubblecommerce/hubble/core/anonymous-middleware/apiCustomerAuthenticate'

    export default {
        name: 'CustomerDashboard',

        components: {CustomerAddresses, CustomerAccountNavigation},

        layout: 'hubble',

        middleware: [
            'apiAuthenticate',
            apiCustomerAuthenticate,
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],

        head() {
            return {
                title: this.$t('Customer Addresses'),
                meta: [
                    { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }
                ]
            }
        }

    }
</script>
