<template>
    <div class="view-category" :class="'is-' + data.cmsPage.type">
        <sw-section
            v-if="data.cmsPage.sections != null"
            v-for="(cmsSection, key) in data.cmsPage.sections"
            :key="key"
            :count="key"
            :content="cmsSection"
        />
    </div>
</template>

<script>
import apiClient from '@/utils/api-client';

export default {
    name: 'Home',

    data() {
        return {
            data: {},
        };
    },

    computed: {
        structuredData: function () {
            return {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                'url': process.env.APP_BASE_URL,
                'potentialAction': {
                    '@type': 'SearchAction',
                    'target': process.env.APP_BASE_URL + '/search?term={search_term_string}',
                    'query-input': 'required name=search_term_string',
                },
            };
        },
    },

    async asyncData({ error, route }) {
        try {
            let postData = {};

            // Set GET params to POST data if set in url
            if (Object.keys(route.query).length > 0) {
                let { setReqParamFromRoute } = await import('../utils/api-parse-get-params');
                postData = setReqParamFromRoute(route, postData);
            }

            let response = await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/category/home',
                data: postData,
            });

            return { data: response.data };
        } catch (e) {
            error({
                statusCode: e.status,
                title: e.title,
                detail: e.detail,
            });
        }
    },

    head() {
        if (this.data.metaTitle != null) {
            obj.title = this.data.metaTitle;
        }

        if (this.data.metaDescription != null) {
            obj.meta.push({
                hid: 'description',
                name: 'description',
                content: this.data.metaDescription,
            });
        }

        let obj = {
            meta: [],
            script: [{ json: this.structuredData, type: 'application/ld+json' }],
        };

        return obj;
    },

    // Watch for $route.query.page to call Component methods (asyncData, fetch, validate, layout, etc.)
    watchQuery: true,
};
</script>
