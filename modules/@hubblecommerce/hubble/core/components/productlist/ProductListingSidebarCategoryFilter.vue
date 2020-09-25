<template>
    <div class="sidebar-nav-wrp">
        <div class="sidebar-nav-title" v-text="$t('Categories')" />
        <div v-for="category in categories" :key="category.key" class="level1-category-item">
            <nuxt-link :to="getManufacturerLink(category.path)" v-text="category.label" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductListingSidebarCategoryFilter',

    props: {
        categories: {
            type: Array,
            required: true,
        },
        manufacturer: {
            type: String,
            required: false,
            default: '',
        },
    },

    methods: {
        getManufacturerLink: function (path) {
            return '/' + this.manufacturer + '/' + path;
        },
    },
};
</script>
