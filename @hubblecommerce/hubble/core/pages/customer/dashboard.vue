<template>
    <div class="main-container">
        <div v-if="customer != null" class="container customer-dashboard">
            <div class="headline-1 pt-4" v-text="`Hi, ${customer.firstName} ${customer.lastName}`" />

            <div class="row">
                <div v-if="$mq === 'md' || $mq === 'lg'" class="col-sm-12 col-md-3 sidebar-wrp">
                    <customer-navigation v-on:logout-success="goToHome" />
                </div>

                <div class="col-sm-12 col-md-9 content-wrp">
                    <div class="row">
                        <div class="col-md-12 headline-wrp">
                            <div class="title" v-text="'Customer Account Dashboard'" />
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="box account-info-wrp">
                                <div class="box-title" v-text="'Account Information'" />

                                <div class="box-content">
                                    <p v-text="`${customer.firstName} ${customer.lastName}`" />
                                    <p v-text="customer.email" />
                                </div>

                                <!--
                                TODO: Implement components customer-password-change and customer-account-information
                                <customer-password-change class="password-change-button" />
                                <customer-account-information />
                                -->
                            </div>
                        </div>
                    </div>

                    <customer-addresses />

                    <!--
                    TODO: Implement components customer-order-list
                    <div class="row">
                        <div class="col-md-12">
                            <customer-order-list :title="'Recent Orders'" :limit="4" />
                        </div>
                    </div>
                    -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/utils/api-client';
import { mapState } from 'vuex';

export default {
    name: 'CustomerDashboard',

    middleware: ['customerAuth'],

    data() {
        return {
            customer: null,
            isLoading: true,
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
    },

    async mounted() {
        try {
            let response = await this.fetchCustomer();

            if (response.data != null) {
                this.customer = response.data;
            }

            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
            throw e;
        }
    },

    methods: {
        fetchCustomer: async function () {
            return await new apiClient().apiCall({
                action: 'get',
                endpoint: 'store-api/v3/account/customer',
                contextToken: this.contextToken,
            });
        },
        goToHome: function () {
            this.$router.push({ path: '/' });
        },
    },

    head() {
        return {
            title: 'Customer Account Dashboard',
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }],
        };
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.customer-dashboard {
    .sidebar-wrp {
        margin: 30px 0 30px 0;

        .link-wrp {
            background-color: #fff;
            padding: 0;
            display: flex;
            flex-direction: column;

            a {
                &.nuxt-link-active {
                    button {
                        color: $primary;
                    }
                }

                button {
                    width: 100%;
                    font-size: 12px;
                    text-transform: uppercase;
                    color: $text-primary;
                    font-weight: bold;
                    box-shadow: none;
                    border: none;
                    text-align: left;
                }
            }
        }
    }

    .content-wrp {
        .headline-wrp {
            text-align: center;
            border-bottom: 1px solid $border-color;
            padding-bottom: 40px;
        }

        .title {
            font-size: 24px;
            margin: 10px 0;
        }

        .box {
            background-color: #fff;
            padding: 15px 0;
            margin-bottom: 20px;

            .box-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }

            .box-content {
                * {
                    font-size: 16px;
                    line-height: 18px;
                }
            }

            .box-utils {
                display: flex;
                flex-wrap: wrap;
            }
        }

        .t-wrapper {
            font-size: 14px;
            padding: 0 15px;
            border: 1px solid $border-color;
        }
    }

    .customer-addresses-wrp {
        border-bottom: none;

        .billing-addresses-wrp,
        .shipping-addresses-wrp {
            border: 1px solid #eee;
            padding: 15px;
            margin-right: 10px;
        }
    }

    .password-change-button {
        margin-top: 15px;
    }
}

.customer-dashboard.customer-orders {
    .content-wrp {
        .box {
            .box-title {
                text-align: center;
                padding-bottom: 25px;
                font-size: 24px;
                font-weight: $font-weight-light;
            }
        }
    }
}

.customer-dashboard.order-detail {
    .order-detail-wrp {
        padding: 30px 0;
    }

    .order-id {
        text-align: center;
        border-bottom: 1px solid $border-color;
        padding-bottom: 42px;
        font-weight: $font-weight-light;

        * {
            font-size: 24px;
            margin: 10px 0;
        }
    }

    .summary-container {
        button {
            display: none;
        }

        .summary-wrp {
            .summary-row.totals {
                border-bottom: none;
            }
        }
    }
}

.customer-dashboard.customer-addresses {
    .customer-addresses-wrp {
        .billing-addresses-wrp,
        .shipping-addresses-wrp {
            border: none;
        }

        .billing-address-wrp,
        .shipping-address-wrp {
            border: 1px solid $border-color;
            padding: 15px;
            margin-bottom: 10px;

            &:nth-child(2) {
                border: 1px solid $success-accent;
                background: #f8f8f8;
            }
        }
    }
}

@media (min-width: 768px) {
    .customer-dashboard {
        .sidebar-wrp {
            .logout-button {
                width: 100%;
                margin-top: 15px;
            }

            .sidebar-link {
                border: 1px solid $border-color;
                border-top: none;

                &:first-child {
                    border-top: 1px solid $border-color;
                }

                button {
                    background: #fff;
                    text-align: center;
                }
            }
        }

        .t-wrapper {
            .t-row {
                .t-col {
                    width: calc(100% / 5);
                }
            }
        }

        .content-wrp {
            .box {
                .box-utils {
                    button {
                        width: auto;
                    }
                }
            }
        }
    }

    .customer-addresses {
        .content-wrp {
            .box {
                .box-utils {
                    button {
                        width: 50%;
                    }
                }
            }
        }
    }

    .login-wrp {
        margin: 40px auto;
    }
}
</style>
