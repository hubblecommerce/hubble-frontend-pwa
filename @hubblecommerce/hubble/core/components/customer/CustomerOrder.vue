<template>
    <div class="customer-orders-line-item-wrp">
        <div class="top-row-wrapper">
            <h1> <span class="order-date-text">Order from </span>{{ getHumanDate(order.orderDate) }} </h1>
            <div class="order-state">
                <p>Status: {{ order.stateMachineState.name }}</p>
                <div
                    class="order-status-badge"
                    :class="{
                        filled: order.stateMachineState.technicalName == 'completed',
                    }"
                ></div>
            </div>
        </div>
        <p class="order-number">Order no. {{ order.orderNumber }}</p>

        <div class="order-details" v-if="isExpanded">
            <table class="product-overview-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody class="lineItems">
                    <tr v-for="lineItem in order.lineItems" :key="lineItem.id">
                        <td class="product-name">
                            <div class="row">
                                <div class="col-3">
                                    <img v-if="lineItem.cover" :src="lineItem.cover.thumbnails[0].url" alt="" srcset="" />
                                </div>
                                <div class="col-9">
                                    <p class="product-name">
                                        {{ lineItem.label }}
                                    </p>
                                    <div class="options">
                                        <p class="option" v-for="(option, key) in lineItem.payload.options" :key="key">
                                            {{ option.group }} {{ option.option }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="product-quantity">
                            {{ lineItem.quantity }}
                        </td>
                        <td class="product-unitprice">
                            {{ formatPrice(lineItem.unitPrice) }}
                        </td>
                        <td class="product-totalprice">
                            {{ formatPrice(lineItem.totalPrice) }}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="product-overview-mobile">
                <div class="product" v-for="lineItem in order.lineItems" :key="lineItem.id">
                    <div class="col-12">
                        <img v-if="lineItem.cover" :src="lineItem.cover.thumbnails[0].url" alt="" srcset="" />
                    </div>
                    <div class="product-info">
                        <p class="product-name">
                            {{ lineItem.label }}
                        </p>
                        <p v-for="option in lineItem.payload.options" :key="option.id">
                            {{ option.name }}
                        </p>
                        <p>Quantity: {{ lineItem.quantity }}</p>
                        <p>Unit price: {{ formatPrice(lineItem.unitPrice) }}</p>
                        <p>Total: {{ formatPrice(lineItem.totalPrice) }}</p>
                    </div>
                </div>
            </div>
            <div class="order-detail-row">
                <div class="shipping-payment-details">
                    <p>
                        Payment method:
                        {{ order.transactions[0].paymentMethod.name }}
                    </p>
                    <p>
                        Shipping method:
                        {{ order.deliveries[0].shippingMethod.name }}
                    </p>
                    <p>
                        Tracking codes:
                        {{ order.deliveries[0].trackingCodes[0] }}
                    </p>
                </div>
                <div class="price-details">
                    <p>
                        Shipping costs:
                        {{ formatPrice(order.deliveries[0].shippingCosts.totalPrice) }}
                    </p>
                    <p> {{ order.price.taxRules[0].taxRate }}% Taxes: {{ formatPrice(order.price.calculatedTaxes[0].tax) }} </p>
                    <p> Total: {{ formatPrice(order.price.totalPrice) }} </p>
                </div>
            </div>
        </div>

        <div class="bottom-row-wrapper">
            <p>
                {{ order.lineItems.length }} Item{{ order.lineItems.length > 1 ? 's' : ''}} for
                {{ formatPrice(order.amountTotal) }}
            </p>

            <hbl-button @click.native="toggleDropdown">
                {{ isExpanded ? 'Hide' : 'Show' }} Information
            </hbl-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomerOrder',
    props: ['order'],

    data() {
        return {
            isLoading: true,
            isExpanded: false,
        };
    },

    async mounted() {
        this.isLoading = false;
    },

    methods: {
        getHumanDate(orderdate) {
            let date = new Date(orderdate);
            return date.toLocaleString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
        formatPrice(price) {
            const formatter = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
            });

            return formatter.format(price);
        },
        toggleDropdown() {
            this.isExpanded = !this.isExpanded;
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.customer-orders-line-item-wrp {
    border: 1px solid rgba(33, 42, 73, 0.1);
    padding: 16px;
    margin-top: 1rem;

    h1 {
        margin-top: 0px;
    }

    p {
        font-size: 16px;
        margin-bottom: 0px;
    }

    .order-number {
        margin-bottom: 20px;
    }

    .top-row-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .order-state {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: rgba(33, 42, 73, 0.5);

            p {
                margin: 0px;
                font-size: 16px;
            }

            .order-status-badge {
                width: 8px;
                height: 8px;
                background-color: #ffcb42;
                border-radius: 50%;
                margin-left: 0.5rem;

                &.filled {
                    background-color: #6ece87;
                }
            }
        }
    }

    .product-overview-table {
        width: 100%;
        text-align: left;
        transition: 2000ms ease-in-out;
        border-collapse: collapse;
        margin-bottom: 1rem;

        th {
            opacity: 0.5;
            color: #212a49;
            font-size: 14px;
            letter-spacing: 0;
            line-height: 24px;
            border-bottom: 1px solid rgba(33, 42, 73, 0.1);
        }

        td {
            border-bottom: 1px solid rgba(33, 42, 73, 0.1);
        }

        .lineItems {
            img {
                width: 100%;
            }

            .product-name {
                max-width: 330px;
                font-weight: 600;
                font-size: 14px;
                padding: 10px 0;
            }

            .options {
                margin-bottom: 10px;

                .option {
                    color: $text-light;
                    font-size: $font-size-sm;
                }
            }
        }
    }

    .order-detail-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 1rem;

        .shipping-payment-details {
            p {
                font-size: 16px;
                color: #212a49;
                margin-bottom: 7px;
            }
        }

        .price-details {
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            p {
                margin: 7px;
                font-weight: 600;
                color: #212a49;
                font-size: 16px;
            }
        }
    }

    .bottom-row-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        p {
            margin: 0px;
        }
    }
    .product-overview-mobile {
        display: none;
    }
}
@media (max-width: 576px) {
    .customer-orders-line-item-wrp {
        margin-top: 1rem;
        padding-bottom: 1rem;
        border: none;
        border-bottom: 1px solid rgba(33, 42, 73, 0.1);

        .top-row-wrapper {
            h1 {
                font-size: 14px;
                margin-bottom: 0px;

                .order-date-text {
                    display: none;
                }
            }
        }

        .order-number {
            font-size: 14px;
            margin-bottom: 20px;
        }

        .product-overview-table {
            display: none;
        }
        .product-overview-mobile {
            display: block;
            margin-top: 1rem;
            p {
                font-size: 14px;
            }

            .product {
                border: 1px solid rgba(33, 42, 73, 0.1);
                padding: 1rem;
                img {
                    width: 100%;
                }
            }

            .product-name {
                font-weight: bold;
            }
        }

        .order-detail-row {
            flex-direction: column;
            margin-top: 1rem;

            p  {
                margin-bottom: 0.5rem;
            }

            .price-details {
                align-items: flex-start;
            }
        }
        .bottom-row-wrapper {
            flex-direction: column;
            align-items: flex-start;

            p {
                margin-bottom: 1rem;
            }

            button {
                width: 100%;
            }
        }
    }
}
</style>
