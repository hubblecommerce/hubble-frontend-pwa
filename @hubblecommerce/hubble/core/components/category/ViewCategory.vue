<template>
    <div class="view-category" :class="`is-${isType}`">
        <breadcrumb class="container" :path="breadcrumb" />

        <div v-if="data.cmsPage.sections != null" class="sections-wrp">
            <sw-section
                v-for="(cmsSection, index) in data.cmsPage.sections"
                :key="cmsSection._uniqueIdentifier"
                :count="index"
                :content="cmsSection"
            />
        </div>
    </div>
</template>

<script>
import { mappingCategory, mappingBreadcrumb } from '@/utils/api-mapping-helper';

export default {
    name: 'ViewCategory',

    props: {
        data: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            category: null,
            breadcrumb: null,
            isType: this.data.cmsPage.type,
        };
    },

    head() {
        let metaDescription = {},
            metaKeywords = {},
            metaTitle = '';

        if (this.category.meta_description != null && this.category.meta_description !== '') {
            metaDescription = this.category.meta_description;
        } else {
            metaDescription = this.$config.meta.category.metaDescription;
        }

        if (this.category.meta_keywords != null && this.category.meta_keywords !== '') {
            metaKeywords = this.category.meta_keywords;
        } else {
            metaKeywords = this.$config.meta.category.metaKeywords;
        }

        if (this.category.meta_title !== null) {
            metaTitle = this.category.meta_title;
        } else if (this.category.name !== '') {
            metaTitle = this.category.name + this.$config.meta.category.titleAdd;
        } else {
            metaTitle = this.$config.meta.category.title;
        }

        return {
            title: metaTitle,
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { hid: 'description', name: 'description', content: metaDescription },
                { hid: 'keywords', name: 'keywords', content: metaKeywords },
                { hid: 'robots', name: 'robots', content: 'INDEX, FOLLOW' },
            ],
        };
    },

    created() {
        this.category = mappingCategory(this.data.category);
        this.breadcrumb = mappingBreadcrumb(this.data.breadcrumb);
    },
};
</script>