<template>
    <div class="detail-wrp" :class="{ container: !data.cmsPage }">
        <breadcrumb v-if="product !== null" :boxed="data.cmsPage != null" :path="breadcrumb" />

        <div v-if="data.cmsPage != null && data.cmsPage.sections != null" class="detail-sections">
             <sw-section
                v-for="(cmsSection, index) in data.cmsPage.sections"
                :key="cmsSection._uniqueIdentifier"
                :count="index"
                :content="cmsSection"
            />
        </div>

       <product-detail v-else :product="product" />
    </div>
</template>

<script>
import { mappingProduct } from '@/utils/api-mapping-helper';

export default {
    name: 'ViewProduct',

    props: {
        data: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            product: null,
            loadCrosssellings: false,
        };
    },

    head() {
        let metaDescription = {},
            metaKeywords = {},
            metaTitle = '';

        if (this.product.meta_description != null) {
            metaDescription = this.product.meta_description;
        } else {
            metaDescription = this.$config.meta.product.metaDescription;
        }

        if (this.product.meta_keywords != null) {
            metaKeywords = this.product.meta_keywords;
        } else {
            metaKeywords = this.$config.meta.product.metaKeywords;
        }

        if (this.product.meta_title != null) {
            metaTitle = this.product.meta_title;
        } else if (this.product.name_orig != null) {
            metaTitle = this.product.name_orig;
        } else {
            metaTitle = this.$config.meta.product.title;
        }

        return {
            title: metaTitle,
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { hid: 'description', name: 'description', content: metaDescription },
                { hid: 'keywords', name: 'keywords', content: metaKeywords },
                { hid: 'robots', name: 'robots', content: this.product.meta_robots },
                { hid: 'og:type', name: 'og:type', content: 'product' },
            ],
            script: [{ json: this.structuredData, type: 'application/ld+json' }],
        };
    },

    computed: {
        structuredData: function () {
            if (this.product === null) {
                return {};
            }

            return {
                '@context': 'http://schema.org',
                '@type': 'Product',
                'name': this.product.name,
                'image': this.product.media.url,
                'description': this.product.description,
                'sku': this.product.sku,
                'brand': {
                    '@type': 'Thing',
                    'name': this.product.manufacturer_name,
                },
                'mpn': this.product.sku,
                'offers': {
                    '@type': 'Offer',
                    'url': this.$config.appBaseUrl.trim() + '/' + this.product.url_pds,
                    'priceCurrency': this.priceCurrency,
                    'price': this.product.final_price_item.display_price_brutto,
                    'itemCondition': 'https://schema.org/NewCondition',
                    'availability': this.product.stock_item.is_in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                },
                // More structured data...
            };
        },
        breadcrumb: function () {
            let path = [];

            if (this.data.breadcrumb != null && Object.keys(this.data.breadcrumb).length > 0) {
                Object.keys(this.data.breadcrumb).forEach((key) => {
                    path.push({
                        name: this.data.breadcrumb[key].name,
                        url: this.data.breadcrumb[key].path,
                    });
                });
            }

            path.push({
                name: this.product.name,
                url: this.product.url_pds,
            });

            return path;
        },
    },

    created() {
        this.product = mappingProduct(this.data);
    },
};
</script>
