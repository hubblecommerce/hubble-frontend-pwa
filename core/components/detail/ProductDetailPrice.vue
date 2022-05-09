<template>
    <div class="price-box">
        <div v-if="item.calculatedPrices.length > 0" class="calculated-prices table">
            <div class="table-head">
                <div class="table-data" v-text="'Quantity'" />
                <div class="table-data" v-text="'Unit price'" />
            </div>

            <div v-for="(price, key) in item.calculatedPrices" class="table-row">
                <div class="table-data" v-text="(key === 0 ? 'to ' : 'from ') + price.quantity" />
                <div class="table-data" v-text="formatPrice(price.unitPrice)" />
            </div>
        </div>

        <template v-else-if="item.calculatedPrice.listPrice">
            <span class="old-price" v-text="formatPrice(item.calculatedPrice.listPrice.price)" />
            <span class="sale-price" v-text="formatPrice(item.final_price_item.display_price_brutto)" />
        </template>

        <template v-else>
            <span class="sale-price" v-text="formatPrice(item.final_price_item.display_price_brutto)" />
        </template>

        <div class="info" v-text="'incl. tax'" />
    </div>
</template>

<script>
export default {
    name: 'ProductDetailPrice',

    props: {
        item: {
            type: Object,
            required: true,
        },
    },

    methods: {
        formatPrice: function (price) {
            const formatter = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
            });

            return formatter.format(price);
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.price-box {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;

    .calculated-prices {
        width: 100%;
        margin-bottom: 20px;

        .table-head {
            display: flex;

            .table-data {
                width: 50%;
            }

            border-bottom: 1px solid $border-color;
            padding: 10px 5px;
        }

        .table-row {
            display: flex;
            border-bottom: 1px solid $border-color;
            padding: 10px 5px;

            &:last-child {
                border: none;
            }

            .table-data {
                width: 50%;
            }
        }
    }

    .sale-price {
        font-size: 18px;
        font-weight: $font-weight-bold;
    }

    .old-price {
        font-size: $font-size-base;
        color: $dark-gray;
        text-decoration: line-through;

        & + .sale-price {
            font-size: 18px;
            font-weight: $font-weight-bold;
        }
    }

    .unit-price-wrp {
        @include font-size($text-font-sizes);
        color: $text-light;
    }

    .info {
        font-size: 14px;
        color: $dark-gray;
    }
}

@media (min-width: 768px) {
    .price-box {
        display: block;
    }
}
</style>
