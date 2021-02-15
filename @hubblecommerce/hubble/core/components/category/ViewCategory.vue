<template>
    <div class="view-category">
        <breadcrumb class="container" :path="breadcrumb" />

        <div class="container">
            <sw-section v-if="data.cmsPage.sections != null" v-for="cmsSection in data.cmsPage.sections" :key="cmsSection.id" :content="cmsSection" />
        </div>
    </div>
</template>

<script>
import {mappingCategory, mappingBreadcrumb} from "@/utils/api-mapping-helper";

export default {
    name: "ViewCategory",

    props: {
        data: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            category: null,
            breadcrumb: null
        }
    },

    created() {
        this.category = mappingCategory(this.data.category);
        this.breadcrumb = mappingBreadcrumb(this.data.breadcrumb);
    },

    head() {
        let metaDescription = {},
            metaKeywords = {},
            metaTitle = '';

        if (this.category.meta_description !== '') {
            metaDescription = this.category.meta_description;
        } else {
            metaDescription = process.env.meta.category.metaDescription;
        }

        if (this.category.meta_keywords !== '') {
            metaKeywords = this.category.meta_keywords;
        } else {
            metaKeywords = process.env.meta.category.metaKeywords;
        }

        if (this.category.meta_title !== '') {
            metaTitle = this.category.meta_title;
        } else if (this.category.name !== '') {
            metaTitle = this.category.name + process.env.meta.category.titleAdd;
        } else {
            metaTitle = process.env.meta.category.title;
        }

        return {
            title: metaTitle,
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { hid: 'description', name: 'description', content: metaDescription },
                { hid: 'keywords', name: 'keywords', content: metaKeywords },
                { hid: 'robots', name: 'robots', content: 'INDEX, FOLLOW' }
            ]
        };
    }
}
</script>

<style lang="scss">
.view-category,
.view-catalogsearch {
    .breadcrumb {
        margin: 15px 0;
    }
}
</style>
