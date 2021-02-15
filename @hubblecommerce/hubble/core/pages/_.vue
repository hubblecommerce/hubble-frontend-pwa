<template>
    <div>
        <component v-if="currentComponent !== null && Object.keys(currentPageData).length > 0" :is="currentComponent" :data="currentPageData" />
    </div>
</template>

<script>
import apiClient from "@/utils/api-client";
import {associations, includes} from "@/utils/api-post-body";

export default {
    name: 'RouteResolver',

    components: {
        ViewCategory: () => import('../components/category/ViewCategory'),
        ViewProduct: () => import('../components/detail/ViewProduct')
    },

    async asyncData({ route, error }) {
        let postData = {
            associations: associations,
            includes: includes,
            path: route.path
        };

        // Set GET params to POST data if set in url
        if(route.query.length > 0) {
            let { setReqParamFromRoute } = await import('../utils/api-parse-get-params');
            postData = setReqParamFromRoute(route, postData);
        }

        try {
            let response = await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/pwa/page',
                data: postData
            });

            if(response.data != null) {
                return response.data;
            }
        } catch (e) {
            error({
                statusCode: e.status,
                title: e.title,
                detail: e.detail
            });
        }
    },

    data() {
        return {
            currentComponent: null,
            currentPageData: {}
        };
    },

    created() {
        if(this.resourceType != null) {
            if (this.resourceType === 'frontend.navigation.page') {
                this.currentComponent = 'view-category';
                Object.assign(this.currentPageData, {category: this.category});
                Object.assign(this.currentPageData, {cmsPage: this.cmsPage});
                Object.assign(this.currentPageData, {breadcrumb: this.breadcrumb});
            }

            if (this.resourceType === 'frontend.detail.page') {
                this.currentComponent = 'view-product';
                Object.assign(this.currentPageData, { product: this.$data.product, configurator: this.$data.configurator});
            }
        }
    }
};
</script>
