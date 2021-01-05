<template>
    <div class="sidebar-nav-wrp">
        <div class="sidebar-nav-title" v-text="$t('Categories')" />
        <div
            v-for="childCategory in parentCategory.children"
            :key="childCategory.id"
            class="level1-category-item"
            :class="{ current: childCategory.id === categoryId }"
        >
            <nuxt-link :to="itemUrlPath(childCategory)" v-text="childCategory.name" />
            <template v-if="childCategory.children">
                <i v-if="childCategory.children.length > 0" class="icon icon-chevron-right" />
                <div
                    v-for="grandChildCategory in childCategory.children"
                    v-if="childCategory.id === categoryId || isInPath(grandChildCategory.parent_id)"
                    :key="grandChildCategory.id"
                    class="level2-category-item"
                    :class="{ current: grandChildCategory.id === categoryId }"
                >
                    <nuxt-link :to="itemUrlPath(grandChildCategory)" v-text="grandChildCategory.name" />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
    name: 'ProductListingSidebarNav',
    props: {
        pathIds: {
            type: Array,
            required: true,
        },
        categoryId: {
            type: [String, Number],
            required: true,
        },
    },
    data() {
        return {
            parentCategory: {},
            isCurrent: false,
        };
    },
    computed: {
        ...mapState({
            dataMenu: (state) => state.modApiMenu.dataMenu,
        }),
        ...mapGetters({
            getApiLocale: 'modApiResources/getApiLocale',
        }),
        parentCategoryId: function () {
            return this.pathIds[0];
        },
    },
    created() {
        this.setParentCategory();
    },
    methods: {
        setParentCategory: function () {
            this.dataMenu.result.items.forEach((item) => {
                if (item.id === this.parentCategoryId) {
                    this.parentCategory = item;
                }
            });
        },
        itemUrlPath(item) {
            let locale = this.getApiLocale;

            let path = item.url_path || item.request_path;

            if (locale !== 'de') {
                return '/' + locale + '/' + path;
            }

            return '/' + path;
        },
        isInPath: function (parent) {
            return this.pathIds.includes(parent);
        },
    },
};
</script>
