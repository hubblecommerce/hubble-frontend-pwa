<template>
    <div :class="elementClass">
        <div class="category-navigation-box">
            <ul class="category-navigation level-0">
                <lazy-product-listing-sidebar-nav
                    v-for="item in dataItems"
                    :key="item.id"
                    :id="item.id"
                    :url="item.request_path"
                    :children="item.children"
                    :label="item.name"
                    :level="item.level"
                />
            </ul>
        </div>
    </div>
</template>

<script>
import { slotMixins } from '../helper';
import ApiClient from '@/utils/api-client';
import { mappingMenu } from '@/utils/api-mapping-helper';

export default {
    name: 'CategoryNavigationSlot',

    mixins: [slotMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            dataItems: [],
            showCustomerForm: false,
        };
    },

    async mounted() {
        try {
            let response = await this.fetchMenu();
            this.dataItems = mappingMenu(response.data);
        } catch (e) {
            throw e;
        }
    },

    methods: {
        fetchMenu: async function () {
            return await new ApiClient(this.$config).apiCall({
                action: 'post',
                endpoint: 'store-api/navigation/main-navigation/main-navigation',
                headers: [{ 'sw-include-seo-urls': true }],
                data: {
                    includes: {
                        category: ['id', 'parentId', 'name', 'level', 'active', '_uniqueIdentifier', 'seoUrls', 'type', 'children', 'externalLink'],
                    },
                    buildTree: true,
                    depth: 5,
                },
            });
        },
    },
};
</script>

<style lang="scss">
</style>
