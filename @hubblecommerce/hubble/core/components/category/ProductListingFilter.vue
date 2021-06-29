<template>
    <div class="product-listing-filter">
        <filter-property
            name= 'Manufacturer'
            :options="manufacturer"
            type="manufacturer"
        />

        <filter-property
            v-for="prop in properties"
            :key="prop.id"
            :name="prop.name"
            :options="prop.options"
            type="properties"
        />

        <filter-property
            name="Price"
            :price="price"
            type="price"
        />
    </div>
</template>

<script>
export default {
    props: {
        aggregations: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        properties() {
            return this.aggregations.properties && this.aggregations.properties.entities.filter(val => val.filterable)
        },
        price() {
            return this.aggregations.price;
        },
        manufacturer() {
            return this.aggregations.manufacturer && this.aggregations.manufacturer.entities;
        }
    }
}
</script>