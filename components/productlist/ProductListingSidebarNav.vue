<template>
    <div class="sidebar-nav-wrp">
        <div class="sidebar-nav-title" v-text="$t('Categories')" />
        <div v-for="childCategory in parentCategory.children" :key="childCategory.id"
            class="level1-category-item"
            :class="{current: childCategory.id === categoryId}"
        >
            <i v-if="childCategory.children.length > 0" class="icon icon-chevron-right" />
            <nuxt-link :to="itemUrlPath(childCategory)" v-text="childCategory.name" />
            <div v-for="grandChildCategory in childCategory.children" :key="grandChildCategory.id"
                v-if="childCategory.id === categoryId || isInPath(grandChildCategory.parent_id)"
                class="level2-category-item"
                :class="{current: grandChildCategory.id === categoryId}"
            >
                <nuxt-link :to="itemUrlPath(grandChildCategory)" v-text="grandChildCategory.name" />
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    export default {
        name: 'ProductListingSidebarNav',
        props: {
            pathIds: {
                type: Array,
                required: true
            },
            categoryId: {
                type: [String, Number],
                required: true
            }
        },
        data() {
            return {
                parentCategory: {},
                isCurrent: false
            }
        },
        computed: {
            ...mapState({
                dataMenu: state => state.modApiResources.dataMenu
            }),
            ...mapGetters({
                getApiLocale: 'modApiResources/getApiLocale'
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
                let _locale = this.getApiLocale();

                if(_locale !== 'de') {
                    return '/' + _locale + '/' + item.url_path;
                }

                return '/' + item.url_path;
            },
            isInPath: function(parent) {
                return this.pathIds.includes(parent);
            }
        }
    }
</script>
