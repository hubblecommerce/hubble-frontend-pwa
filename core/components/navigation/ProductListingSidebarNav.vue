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
@import '~assets/scss/hubble/variables';

.category-navigation {
    background-color: $light-gray;
    list-style: none;

    &.level-0 {
        padding: 30px;
    }
    .category-navigation-link {
        color: $darkest-gray;
        font-weight: bold;
    }
    .nuxt-link-active {
        color: $blue;
    }

    &.level-2 {
        display: none;
        .category-navigation-link {
            font-weight: unset;
            padding-left: 5px;
        }
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
