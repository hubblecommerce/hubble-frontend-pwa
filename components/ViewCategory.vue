<template>
    <div class="view-category">

        <div class="container breadcrumbs-wrp">
            <breadcrumbs :path="breadcrumbs" />
        </div>

        <div class="container category-header">
            <h1 class="title headline-1" v-text="categoryItem.name" />
            <text-excerpt v-if="$mq === 'sm' || $mq === 'md' && categoryText" :text="categoryText" :limit="150" />
            <text-excerpt v-if="$mq === 'lg' && categoryText" :text="categoryText" :limit="300" />
        </div>

        <template v-if="!errorNoProducts">
            <div class="container category-content-wrp">
                <div v-if="$mq === 'lg'" class="sidebar">
                    <product-listing-sidebar-nav :path-ids="pathIds" :category-id="categoryId"/>
                </div>
                <div class="category-products-wrp">
                    <product-listing-filter />
                    <product-listing :data-items="categoryProductItems" />
                    <div class="pagination-bottom">
                        <pagination />
                    </div>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="container flex-center flex-column">
                <component :is="errorPage" :error="error" />
                <nuxt-link :to="routeHistoryBack">
                    <button class="button-primary">
                        Back to Home
                        <material-ripple />
                    </button>
                </nuxt-link>
            </div>
        </template>

    </div>
</template>

<script>
import {mapState} from 'vuex'
import Pagination from './Pagination.vue'
import errorNoItems from '~/components/error/noItems.vue'
import Breadcrumbs from "./Breadcrumbs";
import TextExcerpt from "./TextExcerpt";
import DesktopCategories from "./DesktopCategories";
import ProductListingSidebarNav from "./ProductListingSidebarNav";

export default {
    name: 'CategoryListing',

    components: {
        ProductListingSidebarNav,
        DesktopCategories,
        TextExcerpt,
        Breadcrumbs,
        Pagination
    },

    data() {
        return {
            zippedPath: {},
            error: {
                statusCode: 400,
                message: 'no items found for this category or applied filters!'
            },
            isCollapsed: true
        }
    },

    computed: {
        ...mapState({
            dataCategory: state => state.modApiResources.dataCategory,
            dataCategoryProducts: state => state.modApiResources.dataCategoryProducts
        }),
        categoryItem() {
            if (_.isEmpty(this.dataCategory)) {
                return this.dataCategory
            }

            return this.dataCategory.result.item
        },
        categoryProductItems() {
            if (_.isEmpty(this.dataCategoryProducts)) {
                return this.dataCategoryProducts
            }

            return this.dataCategoryProducts.result.items
        },
        errorPage() {
            return errorNoItems
        },
        errorNoProducts() {
            return _.isEmpty(this.categoryProductItems)
        },
        routeHistoryBack() {
            return '/'
        },
        breadcrumbs() {
            let array = [];
            if (!_.isEmpty(this.dataCategory.result)) {
                let ids = this.dataCategory.result.item.path_ids;
                let names = this.dataCategory.result.item.path_names;
                let urls = this.dataCategory.result.item.path_urls;

                ids.forEach(function(element, index) {
                    array[index] = {
                        name: names[index],
                        url: urls[index]
                    }
                });
            }
            return array;
        },
        categoryText() {
            if(!_.isEmpty(this.categoryItem)) {
                return this.categoryItem.teaser;
            }

            return '';
        },
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
        }
    },

    head() {
        return {
            title: this.categoryItem.name,
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                {
                    hid: 'description',
                    name: 'description',
                    content: this.categoryItem.meta_description
                },
                {hid: 'robots', name: 'robots', content: 'INDEX, FOLLOW'},
                {
                    hid: 'keywords',
                    name: 'keywords',
                    content: this.categoryItem.meta_keyword
                }
            ]
        }
    }
}
</script>
