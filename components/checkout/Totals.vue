<template>
    <div>
        <div class="summary-row sub-totals bg-light">
            <div>{{ $t('Subtotal') }}</div>
            <div>
                <span class="float-right" v-html="getSubTotal()" />
            </div>
        </div>
        <div class="summary-row shipping-costs bg-light">
            <div>{{ $t('Shipping Costs') }}</div>
            <div>
                <span class="float-right" v-html="getShippingCosts()" />
            </div>
        </div>
        <div class="summary-row totals bg-light">
            <div>{{ $t('Totals') }}</div>
            <div>
                <span class="float-right" v-html="getTotal()" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Totals",

        methods: {
            getSubTotal: function() {
                let subtotals = this.$store.getters['modCart/getSubtotals'];

                // Format subtotals
                subtotals = this.$store.getters['modPrices/priceDecFmt'](subtotals);
                subtotals = this.$store.getters['modPrices/priceAddCur'](subtotals);

                return subtotals;
            },
            getShippingCosts: function() {
                let subtotals = this.$store.getters['modCart/getShippingCosts'];

                // Format subtotals
                subtotals = this.$store.getters['modPrices/priceDecFmt'](subtotals);
                subtotals = this.$store.getters['modPrices/priceAddCur'](subtotals);

                return subtotals;
            },
            getTotal: function() {
                let total = this.$store.getters['modCart/getTotals'];

                // Format subtotals
                total = this.$store.getters['modPrices/priceDecFmt'](total);
                total = this.$store.getters['modPrices/priceAddCur'](total);

                return total;
            },
        }
    }
</script>

<style scoped>

</style>
