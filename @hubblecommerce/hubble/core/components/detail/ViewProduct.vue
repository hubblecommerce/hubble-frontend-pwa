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
import useRichSnippets from '@/composables/useRichSnippets';
import { useContext } from '@nuxtjs/composition-api';

export default {
    name: 'ViewProduct',

    setup(props) {
        const product = mappingProduct(props.data);

        const { $config } = useContext();

        const { getStructuredDataProduct } = useRichSnippets();
        let structuredData = getStructuredDataProduct(product, $config);

        return {
            product,
            structuredData
        };
    },

    props: {
        data: {
            type: Object,
            required: true,
        },
    },

    computed: {
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
        category: function () {
            if (Object.keys(this.breadcrumb).length > 0) {
                return this.breadcrumb[Object.keys(this.breadcrumb)[Object.keys(this.breadcrumb).length - 2]].name;
            }

            return 'undefined';
        },
    },

    mounted() {
        $nuxt.$emit('product-detail-view', {
            product: {
                name: this.product.name_orig != null ? this.product.name_orig : this.product.name,
                id: this.product.id,
                sku: this.product.sku != null ? this.product.sku : 'undefined',
                price: this.product.calculatedPrice.unitPrice,
                brand: this.product.manufacturer_name != null ? this.product.manufacturer_name : 'undefined',
                category: this.category,
            },
        });
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
};
</script>
