<template>
    <div class="sidebar-nav-wrp">
        <div class="sidebar-nav-title" v-text="$t('Categories')"></div>

        <div v-for="childCategory in parentCategory.children" :key="childCategory.id"
            class="level1-category-item"
            v-bind:class="{current: childCategory.id === categoryId}">
            <nuxt-link :to="itemUrlPath(childCategory)" v-text="childCategory.name"></nuxt-link>

            <div v-for="grandChildCategory in childCategory.children" :key="grandChildCategory.id"
                v-if="childCategory.id === categoryId || isInPath(grandChildCategory.parent_id)"
                class="level2-category-item"
                v-bind:class="{current: grandChildCategory.id === categoryId}">
                <nuxt-link :to="itemUrlPath(grandChildCategory)" v-text="grandChildCategory.name"></nuxt-link>
            </div>

        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "ProductListingSidebarNav",
        data() {
            return {
                parentCategory: {},
                isCurrent: false
            }
        },
        props: {
            pathIds: {
                type: Array,
                required: true
            },
            categoryId: {
                type: Number,
                required: true
            }
        },
        computed: {
            ...mapState({
                dataMenu: state => state.modApiResources.dataMenu
            }),
            parentCategoryId: function() {
                return this.pathIds[0];
            }
        },
        created() {
            this.setParentCategory();
        },
        methods: {
            setParentCategory: function() {
                this.dataMenu.result.items.forEach((item) => {
                    if(item.id === this.parentCategoryId) {
                        this.parentCategory = item;
                    }
                });
            },
            itemUrlPath(item) {
                let _locale = this.$store.getters['modApiResources/getApiLocale'];

                if(_locale !== 'de') {
                    return '/' + _locale + '/' + item.url_path;
                }

                return '/' + item.url_path;
            },
            isInPath: function(parent) {
                if(this.pathIds.includes(parent)) {
                    return true;
                }

                return false;
            }
        }
    }
</script>
