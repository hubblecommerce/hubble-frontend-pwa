<template>
    <div :class="elementClass">
        <div class="category-navigation-box">
            <product-listing-sidebar-nav :path-ids="pathIds" :category-id="categoryId" />
        </div>
    </div>
</template>

<script>
import ProductListingSidebarNav from '../../productlist/ProductListingSidebarNav';
import { mapState } from 'vuex';
import { slotMixins } from '../helper';
export default {
    name: 'CategoryNavigationSlot',
    components: { ProductListingSidebarNav },
    mixins: [slotMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            categoryItem: {},
        };
    },
    computed: {
        ...mapState({
            dataCategory: state => state.modApiCategory.dataCategory,
        }),
        pathIds() {
            if (!_.isEmpty(this.categoryItem)) {
                return this.categoryItem.path_ids;
            }

            return [];
        },
        categoryId() {
            if (!_.isEmpty(this.categoryItem)) {
                return this.categoryItem.id;
            }

            return 0;
        },
    },

    created() {
        // Set data from store on create instead of use vuex store directly
        // This prevents showing data of next category if user switches between categories
        if (!_.isEmpty(this.dataCategory.result)) {
            this.categoryItem = this.dataCategory.result.item;
        }
    },
};
</script>

<style scoped></style>
