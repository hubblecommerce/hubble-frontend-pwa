<template>
    <div v-if="!isLoading" class="customer-orders-wrp">
        <h4 class="order-heading">{{ title }}</h4>

        <div class="order-wrapper" v-for="order in getOrders" :key="order.id">
            <customer-order :order="order" />
        </div>
    </div>
</template>

<script>
import ApiClient from "@/utils/api-client";
import { mapState } from "vuex";

export default {
    name: "CustomerOrderList",

    middleware: ["customerAuth"],

    props: ["title", "limit"],

    data() {
        return {
            orders: {
                orders: {
                    elements: [],
                },
            },
            isLoading: true,
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
        getOrders() {
            if (this.limit) {
                return this.orders.orders.elements
                    .sort(
                        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                    )
                    .slice(0, this.limit);
            }
            return this.orders.orders.elements.sort(
                (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
            );
        },
    },

    async mounted() {
        try {
            let response = await this.fetchOrders();

            if (response.data != null) {
                this.orders = response.data;
            }

            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
            throw e;
        }
    },

    methods: {
        fetchOrders: async function () {
            return await new ApiClient(this.$config).apiCall({
                action: "post",
                endpoint: "store-api/order",
                contextToken: this.contextToken,
                data: {
                    // includes: {
                    //     order: [
                    //         "orderNumber",
                    //         "orderDate",
                    //         "lineItems",
                    //         "id",
                    //         "amountTotal",
                    //         "stateMachineState",
                    //     ],
                    // },
                    associations: {
                        lineItems: {
                            associations: {
                                cover: {},
                                product: {
                                    associations: {
                                        featureSet: {},
                                        options: {},
                                    },
                                },
                            },
                        },
                        deliveries: {
                            associations: {
                                shippingMethod: {},
                            },
                        },
                        transactions: {
                            associations: {
                                paymentMethod: {},
                            },
                        },
                    },
                },
            });
        },
    },
};
</script>

<style lang="scss">
.order-heading {
    margin-bottom: 1rem;
}
</style>
