<template>
    <div class="order-detail-wrp">
        <div class="order-id"> <span class="label" v-text="$t('Your Order Id: ')" /><span v-if="order" v-text="order.id" /> </div>

        <div class="order-row">
            <div v-for="(address, key) in orderData.addresses" :key="key" class="order-col billing-addresses-wrp">
                <div v-if="address.is_billing" class="headline headline-3" v-text="$t('Billing Address')" />

                <div v-if="address.is_shipping" class="headline headline-3" v-text="$t('Shipping Address')" />

                <div class="billing-address-wrp">
                    <div>
                        <span v-text="mapKeyToValue(address.payload.gender, salutations)" />
                        <span v-text="address.payload.firstName" />
                        <span v-text="address.payload.lastName" />
                    </div>

                    <div>
                        <span v-text="address.payload.street" />
                        <span v-text="address.payload.houseNo" />
                    </div>

                    <div>
                        <span v-text="address.payload.postal" />
                        <span v-text="address.payload.city" />
                    </div>

                    <div>
                        <span v-text="mapIsoToCountry(address.payload.country, countries)" />
                    </div>
                </div>
            </div>

            <div class="order-col order-info-wrp">
                <div class="headline headline-3" v-text="$t('Information')" />

                <div v-if="orderData.chosenShippingMethod" class="shippping-method">
                    <span class="label" v-text="$t('Shipping') + ': '" />
                    <span class="value" v-text="orderData.chosenShippingMethod.label" />
                </div>

                <div v-if="orderData.chosenPaymentMethod" class="payment-method">
                    <span class="label" v-text="$t('Payment') + ': '" />
                    <span class="value" v-text="$t(orderData.chosenPaymentMethod.label)" />
                </div>
            </div>
        </div>

        <cart-items-list-non-interactive v-if="orderData.cart" :cart="orderData.cart" />

        <div class="summary-container">
            <div class="summary-wrp">
                <div class="summary-row sub-totals bg-light">
                    <div v-text="$t('Subtotal')" />

                    <div>
                        <span v-if="orderData.cart" class="float-right" v-text="getSubTotal()" />
                    </div>
                </div>

                <div class="summary-row shipping-costs bg-light">
                    <div v-text="$t('Shipping Costs')" />

                    <div>
                        <span v-if="orderData.cart" class="float-right" v-text="getShippingCost()" />
                    </div>
                </div>

                <div class="summary-row totals bg-light">
                    <div v-text="$t('Totals')" />

                    <div>
                        <span v-if="orderData.cart" class="float-right" v-text="getTotal()" />
                    </div>
                </div>

                <nuxt-link :to="localePath('index')">
                    <button class="button-secondary" v-text="$t('Back to shop')" />
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { mapKeyToValue, mapIsoToCountry, salutations } from '@hubblecommerce/hubble/core/utils/formMixins';
import _ from 'lodash';

export default {
    name: 'OrderDetail',

    components: { 
        CartItemsListNonInteractive: () => import('../checkout/CartItemsListNonInteractive')
    },

    mixins: [mapKeyToValue, mapIsoToCountry, salutations],

    props: {
        order: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            orderData: {},
        };
    },

    computed: {
        ...mapState({
            countries: state => state.modApiCustomer.availableCountries,
        }),
        ...mapGetters({
            priceDecFmt: 'modPrices/priceDecFmt',
            priceAddCur: 'modPrices/priceAddCur',
        }),
    },

    mounted() {
        if (_.isEmpty(this.countries)) {
            // TODO
            this.getAvailableCountries('modApiCustomer/getAvailableCountries');
        }
        this.orderData = JSON.parse(this.order.payload);
    },

    methods: {
        ...mapActions({
            getAvailableCountries: 'modApiCustomer/getAvailableCountries',
        }),
        getSubTotal: function () {
            let subtotals = this.orderData.cart.subtotal;

            // Format subtotals
            subtotals = this.priceDecFmt(subtotals);
            subtotals = this.priceAddCur(subtotals);

            return subtotals;
        },
        getShippingCost: function () {
            let shippingCost = this.orderData.shippingCost.price;

            // Format subtotals
            shippingCost = this.priceDecFmt(shippingCost);
            shippingCost = this.priceAddCur(shippingCost);

            return shippingCost;
        },
        getTotal: function () {
            let total = this.orderData.cart.grand_total;

            // Format subtotals
            total = this.priceDecFmt(total);
            total = this.priceAddCur(total);

            return total;
        },
    },
};
</script>
