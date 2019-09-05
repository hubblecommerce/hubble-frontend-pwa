<template>
    <div class="main-container">
        <div class="container customer-dashboard">
            <div class="row">
                <div class="col-sm-12 col-md-3 sidebar-wrp" v-if="$mq === 'md' || $mq === 'lg'">
                    <customer-account-navigation></customer-account-navigation>
                </div>
                <div class="col-sm-12 col-md-9 content-wrp">
                    <div class="row">
                        <div class="col-md-12">
                            <customer-order-list></customer-order-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import CustomerAccountNavigation from "../../components/CustomerAccountNavigation";
    import CustomerOrderList from "../../components/CustomerOrderList";

    export default {
        name: 'CustomerDashboard',

        components: {CustomerOrderList, CustomerAccountNavigation},

        layout: 'hubble',

        middleware: [
            'authRequired',
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ]
    }
</script>
