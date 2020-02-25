 <template>
    <div class="order-detail-wrp">

        <div class="order-id">
            <span class="label" v-text="$t('Your Order Id: ')" /><span v-if="order" v-text="order.id" />
        </div>

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
                    <span class="label" v-text="$t('Shipping')+': '" />
                    <span class="value" v-text="orderData.chosenShippingMethod.label" />
                </div>
                <div v-if="orderData.chosenPaymentMethod" class="payment-method">
                    <span class="label" v-text="$t('Payment')+': '" />
                    <span class="value" v-text="$t(orderData.chosenPaymentMethod.label)" />
                </div>
            </div>
        </div>

        <cart-items-list-non-interactive v-if="orderData.cart" :cart="orderData.cart" />

        <div class="summary-container">
            <div class="summary-wrp">
                <div class="summary-row sub-totals bg-light">
                    <div>{{ $t('Subtotal') }}</div>
                    <div>
                        <span v-if="orderData.cart" class="float-right" v-html="getSubTotal()" />
                    </div>
                </div>
                <div class="summary-row shipping-costs bg-light">
                    <div>{{ $t('Shipping Costs') }}</div>
                    <div>
                        <span v-if="orderData.cart" class="float-right" v-html="getShippingCost()" />
                    </div>
                </div>
                <div class="summary-row totals bg-light">
                    <div>{{ $t('Totals') }}</div>
                    <div>
                        <span v-if="orderData.cart" class="float-right" v-html="getTotal()" />
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
    import { mapState } from 'vuex';
    import CartItemsListNonInteractive from "../checkout/CartItemsListNonInteractive";
    import {mapKeyToValue, mapIsoToCountry, salutations} from "@hubblecommerce/hubble/core/utils/formMixins";

    export default {
        name: "OrderDetail",

        components: {CartItemsListNonInteractive},

        mixins: [mapKeyToValue, mapIsoToCountry, salutations],

        props: {
            order: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                orderData: {},
            }
        },

        computed: {
            ...mapState({
                countries: state => state.modApiCustomer.availableCountries,
            }),
        },

        mounted() {
            if(_.isEmpty(this.countries)) {
                this.$store.dispatch('modApiCustomer/getAvailableCountries');
            }
            this.orderData = JSON.parse(this.order.payload);
        },

        methods: {
            getSubTotal() {
                let subtotals = this.orderData.cart.subtotal;

                // Format subtotals
                subtotals = this.$store.getters['modPrices/priceDecFmt'](subtotals);
                subtotals = this.$store.getters['modPrices/priceAddCur'](subtotals);

                return subtotals;
            },
            getShippingCost() {
                let shippingCost = this.orderData.shippingCost.price;

                // Format subtotals
                shippingCost = this.$store.getters['modPrices/priceDecFmt'](shippingCost);
                shippingCost = this.$store.getters['modPrices/priceAddCur'](shippingCost);

                return shippingCost;
            },
            getTotal() {
                let total = this.orderData.cart.grand_total;

                // Format subtotals
                total = this.$store.getters['modPrices/priceDecFmt'](total);
                total = this.$store.getters['modPrices/priceAddCur'](total);

                return total;
            }
        }
    }
</script>

