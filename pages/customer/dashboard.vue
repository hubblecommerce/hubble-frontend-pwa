<template>
    <div class="main-container">
        <div v-if="customerData" class="container customer-dashboard">
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

                                <customer-account-information />
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
    import _ from 'lodash';

    import CustomerAccountNavigation from "../../components/customer/CustomerAccountNavigation";
    import CustomerOrderList from "../../components/customer/CustomerOrderList";
    import CustomerAddresses from "../../components/customer/CustomerAddresses";
    import CustomerPasswordChange from "../../components/customer/CustomerPasswordChange";
    import CustomerAccountInformation from "../../components/customer/CustomerAccountInformation";

    export default {
        name: 'CustomerDashboard',

        components: {
            CustomerAccountNavigation,
            CustomerOrderList,
            CustomerAddresses,
            CustomerPasswordChange,
            CustomerAccountInformation
        },

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
                orders: []
            }
        },

        mounted() {
            if(this.customer.customerData == null || _.isEmpty(this.customer.customerData)) {
                this.$store.dispatch('modApiCustomer/getCustomerInfo');
            }
        },

        computed: {
            ...mapState({
                customer: state => state.modApiCustomer.customer
            }),
            customerData: function() {
                if(this.customer.customerData != null && ! _.isEmpty(this.customer.customerData)) {
                    return this.customer.customerData;
                }
                return false;
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
