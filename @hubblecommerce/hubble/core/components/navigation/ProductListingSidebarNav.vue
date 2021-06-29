<template>
    <li class="category-navigation-entry">
        <a v-if="isExternalUrl(url)" :href="url" target="_blank" class="category-navigation-link" rel="noopener nofollow" v-text="label" />
        <nuxt-link v-else :key="id" :ref="id" class="category-navigation-link" :name="label" :to="'/' + url" v-text="label" />
        <ul class="category-navigation" v-if="children" :class="`level-${level}`">
            <product-listing-sidebar-nav
                v-for="item in children"
                :key="item.id"
                :children="item.children"
                :label="item.name"
                :level="item.level"
                :url="item.request_path"
            >
            </product-listing-sidebar-nav>
        </ul>
    </li>
</template>

<script>
export default {
    name: 'ProductListingSidebarNav',

    props: ['label', 'children', 'level', 'url', 'id'],

    methods: {
        isExternalUrl(item) {
            return item.includes('http');
        },
    },
};
</script>

<style lang="scss">
.category-navigation {
    &.level-2 {
        display: none;
    }
}

.category-navigation-link {
    &.nuxt-link-active {
        + .level-2 {
            display: block;
        }
    }
}
</style>
