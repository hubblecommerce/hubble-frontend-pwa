<template>
    <div />
</template>

<script>
    import {mapState} from 'vuex';
    import {clearDataLayer} from "@hubblecommerce/hubble/core/utils/gtmHelper";
    import _ from 'lodash';

    export default {
        name: "GTMDataLayer",

        props: {
            event: {
                type: String,
                required: false,
                default: ''
            },
            pageType: {
                type: String,
                required: false,
                default: ''
            },
            pageTitle: {
                type: String,
                required: false,
                default: ''
            },
            breadcrumbs: {
                type: Array,
                required: false,
                default: () => {}
            },
            eCommerceDetail: {
                type: Object,
                required: false,
                default: () => {}
            }
        },

        computed: {
            ...mapState({
                customer: state => state.modApiCustomer.customer
            }),
        },

        mounted() {
            if(this.$gtm) {
                this.setDataLayer();
            }
        },

        methods: {
            setDataLayer: function() {

                clearDataLayer().then(() => {
                    let customerId, group, email;

                    // Aggregate customer data
                    if(this.customer.customerData) {
                        if(this.customer.customerData.id) {
                            customerId = this.customer.customerData.id;
                            group = 'loggedIn';
                        } else {
                            group = 'loggedOut';
                        }

                        if(this.customer.customerData.email) {
                            email = this.customer.customerData.email;
                        }
                    }

                    // Default dataLayer to load on most pages
                    let dataLayer = {
                        'event': this.event,
                        'pageType': this.pageType,
                        'pageTitle': this.pageTitle,
                        'breadcrumbs': this.breadcrumbs,
                        'customer': {
                            'id': customerId,
                            'group': group,
                            'email': email
                        }
                    };

                    // Fill dataLayer with product detail info
                    if(!_.isEmpty(this.eCommerceDetail)) {
                        dataLayer.ecommerce = this.eCommerceDetail;
                    }

                    if(_.isEmpty(this.eCommerceDetail)) {
                        dataLayer.ecommerce = {}
                    }

                    this.$gtm.pushEvent(dataLayer);

                });

            }
        }
    }
</script>

