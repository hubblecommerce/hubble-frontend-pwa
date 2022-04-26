<template>
    <div>
        <component
            v-if="currentComponent !== null && Object.keys(currentPageData).length > 0"
            :is="currentComponent"
            :data="currentPageData"
            :key="$route.fullPath"
        />
    </div>
</template>

<script>
import ApiClient from '@/utils/api-client';
import { associations, includes } from '@/utils/api-post-body';

export default {
    name: 'RouteResolver',

    components: {
        ViewCategory: () => import('../components/category/ViewCategory'),
        ViewProduct: () => import('../components/detail/ViewProduct'),
    },

    async asyncData({ $config, route, error }) {
        let postData = {
            associations: associations,
            includes: includes,
            path: route.path,
        };

        // Set GET params to POST data if set in url
        if (Object.keys(route.query).length > 0) {
            let { setReqParamFromRoute } = await import('../utils/api-parse-get-params');
            postData = setReqParamFromRoute(route, postData);
        }

        try {
            let response = await new ApiClient($config).apiCall({
                action: 'post',
                endpoint: 'store-api/pwa/page',
                headers: [{ 'sw-include-seo-urls': true }],
                data: postData,
            });

            let currentComponent = null;
            let currentPageData = {};

            if (response.data.resourceType != null) {
                if (response.data.resourceType === 'frontend.navigation.page') {
                    currentComponent = 'view-category';
                    Object.assign(currentPageData, { category: response.data.category });
                    Object.assign(currentPageData, { cmsPage: response.data.cmsPage });
                    Object.assign(currentPageData, { breadcrumb: response.data.breadcrumb });
                }

                if (response.data.resourceType === 'frontend.detail.page') {
                    currentComponent = 'view-product';
                    Object.assign(currentPageData, {
                        product: response.data.product,
                        configurator: response.data.configurator,
                        breadcrumb: response.data.breadcrumb,
                        cmsPage: response.data.cmsPage
                    });
                }
            }

            if (response.data != null) {
                return {
                    currentComponent: currentComponent,
                    currentPageData: currentPageData,
                };
            }
        } catch (e) {
            console.log(e);
            error({
                statusCode: e.status,
                title: e.title,
                detail: e.detail,
            });
        }
    },

    // Watch for $route.query.page to call Component methods (asyncData, fetch, validate, layout, etc.)
    watchQuery: true,
};
</script>
