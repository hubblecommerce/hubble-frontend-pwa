<template>
    <div class="product-listing-filter">
        <div class="product-listing-filter__properties">
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

        <filter-pills v-if="anyFilterSet" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        aggregations: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        ...mapGetters({
            anyFilterSet: 'modFilter/anyFilterSet',
        }),
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