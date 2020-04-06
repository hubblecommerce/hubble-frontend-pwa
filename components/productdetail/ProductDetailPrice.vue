<template>
    <div class="price-box price-wrp">

        <div class="calculated-prices table" v-if="item.calculatedPrices">
            <div class="table-head">
                <div class="table-data">Quantity</div>
                <div class="table-data">Unit price</div>
            </div>
            <div class="table-row" v-for="(price, key) in item.calculatedPrices">
                <div class="table-data" v-text="(key === 0 ? $t('to ') : $t('from ')) + price.quantity" />
                <div class="table-data" v-text="getPriceAndCurrencyDecFmt(price.unitPrice, false, itemTaxClass)" />
            </div>
        </div>

        <template v-else-if="itemIsSpecial">
            <span class="old-price" v-html="getPriceAndCurrency('display_price_brutto', priceSwitcherIncludeVat)" />
            <span class="sale-price" v-html="getPriceAndCurrency('display_price_brutto_special', priceSwitcherIncludeVat)" />
        </template>

        <template v-else>
            <span class="sale-price" v-html="getPriceAndCurrency('display_price_brutto', priceSwitcherIncludeVat)" />
        </template>

        <div v-if="item.final_price_item.priceinfo !== null" class="unit-price-wrp">
            <span class="price" v-text="getPriceAndCurrency('priceinfo', false)" />
            <span class="label" v-text="'/l'" />
        </div>

        <div class="info"><span>{{ $t('incl_tax') }}</span> </div>

    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    export default {
        name: "ProductDetailPrice",

        props: {
            item: {
                type: Object,
                required: true
            }
        },

        computed: {
            ...mapState({
                priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat,
            }),
            ...mapGetters({
                productIsSpecial: 'modPrices/productIsSpecial',
                getTaxClassByLabel: 'modPrices/getTaxClassByLabel',
                getPriceAndCurrencyDecFmt: 'modPrices/getPriceAndCurrencyDecFmt'
            }),
            itemTaxClass() {
                return this.getTaxClassByLabel(this.item.final_price_item.tax_class_id);
            },
            itemIsSpecial() {
                return this.productIsSpecial(this.item);
            },
        },

        methods: {
            getPriceAndCurrency(key, addVat) {
                return this.getPriceAndCurrencyDecFmt(this.item.final_price_item[key], addVat, this.itemTaxClass);
            },
        }
    }
</script>
