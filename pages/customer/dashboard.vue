<template>
    <div class="main-container">
        <div class="container customer-dashboard">
            <div class="headline-1 pt-4">
                {{ $t('Hi,') }} {{ customerData.name }}
            </div>
            <div class="row">
                <div v-if="$mq === 'md' || $mq === 'lg'" class="col-sm-12 col-md-3 sidebar-wrp">
                    <customer-account-navigation />
                </div>
                <div class="col-sm-12 col-md-9 content-wrp">
                    <div class="row">
                        <div class="col-md-12 headline-wrp">
                            <div class="title">
                                {{ $t('Customer Account Dashboard') }}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="box account-info-wrp">
                                <div class="box-title">
                                    {{ $t('Account Information') }}
                                </div>
                                <div class="box-content">
                                    <p>{{ customerData.name }}</p>
                                    <p>{{ customerData.email }}</p>
                                </div>
                                <customer-password-change class="password-change-button" />
                            </div>
                        </div>
                    </div>
                    <customer-addresses />
                    <div class="row">
                        <div class="col-md-12">
                            <customer-order-list :title="$t('Recent Orders')" :limit="4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import CustomerAccountNavigation from "../../components/customer/CustomerAccountNavigation";
    import CustomerOrderList from "../../components/customer/CustomerOrderList";
    import CustomerAddresses from "../../components/customer/CustomerAddresses";
    import CustomerPasswordChange from "../../components/customer/CustomerPasswordChange";

    export default {
        name: 'CustomerDashboard',

        components: {CustomerAddresses, CustomerOrderList, CustomerAccountNavigation, CustomerPasswordChange},

        layout: 'hubble',

        middleware: [
            'apiAuthenticate',
            'apiLocalization',
            'apiPaymentAuthenticate',
            'apiCustomerAuthenticate',
            'apiResourceMenu',
            'trackClickPath'
        ],

        data() {
            return {
                curComponent: 'view-auth',
                orders: []
            }
        },

        computed: {
            ...mapState({
                customer: state => state.modApiCustomer.customer
            }),
            customerData() {
                return this.customer.customerData;
            },
            customerAddresses() {
                return this.customer.customerAddresses;
            }
        },

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
