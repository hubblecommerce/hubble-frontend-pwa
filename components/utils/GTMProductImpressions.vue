<template>
    <div />
</template>

<script>
import _ from 'lodash';

export default {
    name: 'GTMProductImpressions',

    props: {
        products: {
            type: Array,
            required: false,
            default: () => {},
        },
        list: {
            type: String,
            required: false,
            default: '',
        },
        category: {
            type: String,
            required: false,
            default: '',
        },
    },

    mounted() {
        if (this.$gtm) {
            this.setDataLayer();
        }
    },

    methods: {
        setDataLayer: function () {
            let impressions = [];

            _.forEach(this.products, (product, key) => {
                impressions.push({
                    name: product.name,
                    id: product.id,
                    price: this.getPriceAndCurrency(product),
                    brand: product.manufacturer_name,
                    category: this.category,
                    list: this.list,
                    position: key + 1,
                });
            });

            this.$gtm.pushEvent({
                event: 'productsLoaded',
                ecommerce: {
                    currencyCode: 'EUR',
                    impressions: impressions,
                    detail: undefined,
                    remove: undefined,
                    click: undefined,
                    purchase: undefined,
                    add: undefined,
                },
            });
        },
        itemTaxClass(taxClassId) {
            return this.$store.getters['modPrices/getTaxClassByLabel'](taxClassId);
        },
        getPriceAndCurrency(product) {
            let key = 'display_price_brutto';

            if (product.final_price_item.special_price !== null) {
                key = 'display_price_brutto_special';
            }

            return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](
                product.final_price_item[key],
                false,
                this.itemTaxClass(product.final_price_item.tax_class_id)
            );
        },
    },
};
</script>
