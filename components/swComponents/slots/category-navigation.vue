<template>
    <product-listing-sidebar-nav :path-ids="pathIds" :category-id="categoryId" />
</template>

<script>
    import ProductListingSidebarNav from '../../productlist/ProductListingSidebarNav'
    import { mapState } from 'vuex'
    export default {
        name: 'CategoryNavigationSlot',
        components: { ProductListingSidebarNav },

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
                dataCategory: state => state.modApiResources.dataCategory,
                dataMenu: state => state.modApiResources.dataMenu

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
            console.log('category nav: ', this.content)
            console.log(this.dataCategory)
            console.log(this.dataMenu)
            // Set data from store on create instead of use vuex store directly
            // This prevents showing data of next category if user switches between categories
            if(!_.isEmpty(this.dataCategory.result)) {
                this.categoryItem = this.dataCategory.result.item;
            }

        },


    }
</script>

<style scoped>

</style>
