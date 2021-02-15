<template>
    <div class="search-suggest-list-wrp container">
        <div class="row">
            <div class="col-12">
                <div v-if="categories.length > 0">
                    <div class="headline" v-text="'Categories'" />

                    <div v-for="(category, key) in categories" :key="key" class="elements-wrp">
                        <nuxt-link :to="'/' + category.url_path" class="element" v-text="category.heading_title" />
                    </div>
                </div>

                <div v-if="products.length > 0">
                    <div class="headline" v-text="`Products (${products.length})`" />

                    <div v-for="(product, key) in products" :key="key" class="elements-wrp" >
                        <nuxt-link :to="'/' + product.url_pds" class="element">
                            <img data-no-lazy :src="product.image" :alt="product.name" />
                            <span class="name" v-text="product.name" />
                            <span class="price" v-text="formatPrice(product.price)" />
                        </nuxt-link>
                    </div>
                </div>

                <div v-if="categories.length <= 0 && products.length <= 0">
                    <div class="headline" v-text="'No results found'" />

                    <div class="elements-wrp">
                        <div class="element" v-text="'We are sorry there is no such product. Please try another one.'" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TheSearchSuggestList',

    props: {
        categories: {
            type: Array,
            required: false,
            default: () => []
        },
        products: {
            type: Array,
            required: false,
            default: () => []
        }
    },

    methods: {
        formatPrice: function(price) {
            const formatter = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2
            });

            return formatter.format(price);
        }
    }
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.search-suggest-list-wrp {
    background: $background;
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;

    .headline {
        font-weight: bold;
    }

    .elements-wrp {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid $border-color;
        padding: 10px 0;

        &:last-child {
            border: none;
        }
    }

    .element {
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
            width: 50px;
            margin-right: 10px;
        }

        .name {
            width:  100%;
            text-align: left;
            line-height: 21px;
        }

        .price {
            width: 80px;
            text-align: right;
        }
    }
}
</style>
