<template>
    <div class="filter-pills">
        Your selection:

        <filter-pill
            v-for="pill in manufacturer"
            :id="pill"
            :key="pill" 
            type="manufacturer" />

        <filter-pill
            v-for="pill in properties"
            :id="pill"
            :key="pill" 
            type="properties" />

        <filter-pill
            v-if="minMaxPrice.min"
            type="price" />

        <button @click="resetFilters">Reset all filters</button>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            properties: state => state.modFilter.properties,
            manufacturer: state => state.modFilter.manufacturer,
            minMaxPrice: state => state.modFilter.minMaxPrice
        }),
    },

    methods: {
        resetFilters() {
            this.$store.commit('modFilter/resetFilters', true);
        }
    }
}
</script>