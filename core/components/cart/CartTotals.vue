<template>
    <div class="cart-totals">
        <div class="row cart-total-item cart-total-subtotal">
            <div class="col-6" v-text="'Subtotal'" />
            <div class="col-6 value" v-text="formatPrice(totals.subTotals)" />
        </div>

        <div class="row cart-total-item cart-total-shipping">
            <div class="col-6" v-text="'Shipping'" />
            <div class="col-6 value" v-text="formatPrice(totals.shippingCosts)" />
        </div>

        <div class="row cart-total-item cart-total-totals">
            <div class="col-6" v-text="'Totals'" />
            <div class="col-6 value" v-text="formatPrice(totals.totals)" />
        </div>

        <div class="row cart-total-item cart-tax">
            <div class="col-12 value" v-text="`Includes ${formatPrice(totals.tax[0].tax)} (${totals.tax[0].taxRate}% VAT)`" />
        </div>
    </div>
</template>

<script>
export default {
    name: "CartTotals",

    props: {
        totals: {
            type: Object,
            required: true
        }
    },

    methods: {
        formatPrice: function (price) {
            const formatter = new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
            });

            return formatter.format(price);
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/hubble/variables";
@import "~assets/scss/hubble/typography";

.cart-totals {
    background: $light-gray;
    padding: 30px 50px;
    margin-bottom: 20px;
    width: 100%;

    .value {
        text-align: right;
    }
}

.cart-total-item {
    margin-bottom: 10px;
}

.cart-total-totals {
    padding-top: 10px;
    margin-bottom: 0;
    font-weight: $font-weight-bold;
}

.cart-tax {
    font-size: $font-size-xs;
    color: $text-light;
    line-height: 18px;
}

@media (min-width: 1024px) {
    .transition-expand-wrp {
        .cart-totals {
            margin-left: 40px;
            margin-right: 25px;
        }
    }
}
</style>