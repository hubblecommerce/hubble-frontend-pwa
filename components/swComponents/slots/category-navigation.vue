<template>
    <div :class="elementClass">
        <div class="category-navigation-box">
            <product-listing-sidebar-nav :path-ids="pathIds" :category-id="categoryId" />
        </div>
    </div>
</template>

<script>
    import ProductListingSidebarNav from '../../productlist/ProductListingSidebarNav'
    import { mapState } from 'vuex'
    import { slotMixins } from '../helper'
    import _ from 'lodash';

    export default {
        name: 'CategoryNavigationSlot',
        components: { ProductListingSidebarNav },
        mixins: [slotMixins],

        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {
                categoryItem: {},
            }
        },
        computed: {
            ...mapState({
                dataCategory: state => state.modApiCategory.dataCategory,
            }),
            pathIds() {
                if(!_.isEmpty(this.categoryItem)) {
                    return this.categoryItem.path_ids;
                }

                return [];
            },
            categoryId() {
                if(!_.isEmpty(this.categoryItem)) {
                    return this.categoryItem.id;
                }

                return 0;
            },
        },
        created() {
            if(!_.isEmpty(this.dataCategory.result)) {
                this.categoryItem = this.dataCategory.result.item;
            }
        },
    }
</script>
