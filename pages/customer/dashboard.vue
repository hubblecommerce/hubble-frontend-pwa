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
                            <div class="title">{{ $t('Customer Account Dashboard') }}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="box elevation-2">
                                <div class="box-title">{{ $t('Account Information') }}</div>
                                <div class="box-content">
                                    <p>{{ authUser.username }}</p>
                                    <p>{{ authUser.email }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="box elevation-2">
                                <div class="box-title">{{ $t('Shipping Address') }}</div>
                                <div v-if="shippingAddresses.length > 0" class="box-content">
                                    <p>{{shippingAddresses[0].firstName}} {{shippingAddresses[0].lastName}}</p>
                                    <p>{{shippingAddresses[0].street}} {{shippingAddresses[0].houseNo}}</p>
                                    <p>{{shippingAddresses[0].postcode}} {{shippingAddresses[0].city}}</p>
                                </div>
                                <div v-else class="box-content">
                                    <p>{{$t('No shipping address')}}</p>
                                </div>
                                <div class="box-utils">
                                    <nuxt-link :to="localePath('customer-addresses')" class="w-100">
                                        <button class="rct-button-secondary w-100">
                                            {{ $t('Edit Address') }}
                                            <material-ripple></material-ripple>
                                        </button>
                                    </nuxt-link>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="box elevation-2">
                                <div class="box-title">{{ $t('Invoice Address') }}</div>
                                <div v-if="billingAddresses.length > 0" class="box-content">
                                    <p>{{billingAddresses[0].firstName}} {{billingAddresses[0].lastName}}</p>
                                    <p>{{billingAddresses[0].street}} {{billingAddresses[0].houseNo}}</p>
                                    <p>{{billingAddresses[0].postcode}} {{billingAddresses[0].city}}</p>
                                </div>
                                <div v-else class="box-content">
                                    <p>{{$t('No billing address')}}</p>
                                </div>
                                <div class="box-utils">
                                    <nuxt-link :to="localePath('customer-addresses')" class="w-100">
                                        <button class="rct-button-secondary w-100">
                                            {{ $t('Edit Address') }}
                                            <material-ripple></material-ripple>
                                        </button>
                                    </nuxt-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <customer-order-list :limit="4"></customer-order-list>
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

        data() {
            return {
                curComponent: 'view-auth'
            }
        },

        computed: {
            ...mapState({
                authUser: state => state.modUser.authUser,
                shippingAddresses: state => state.modUser.authUser.customerShippingAddresses,
                billingAddresses: state => state.modUser.authUser.customerBillingAddresses,
                orders: state => state.modUser.authUser.customerOrders
            })
        },

        middleware: [
            'authRequired',
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],

        methods: {
            attemptLogout() {

                this.$store.dispatch('modUser/attemptLogout')
                .then(response => {

                    this.$router.push({
                        path: '/customer/login'
                    });
                })
                .catch(response => {
                    // console.log("attemptLogout ... backend response success: %o", response);
                })
            },
        }
    }
</script>
