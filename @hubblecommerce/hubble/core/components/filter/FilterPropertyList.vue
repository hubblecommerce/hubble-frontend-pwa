<template>
    <div class="filter-property-list">
        <filter-property-list-price
            v-if="type === 'price'" 
            :price="price" />

        <filter-property-list-default
            v-else
            :options="options"
            :type="type" />
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            default: () => ([]),
        },
        type: {
            type: String,
            default: '',
            required: false,
        },
        price: {
            type: Object,
            default: () => ({}),
        }
    },
}
</script>

<style lang="scss">
@import '~assets/scss/hubble/transitions';

.filter-property-list {
    position: absolute;
    z-index: 1;
    width: 100%;
    background-color: white;
    border: 1px solid grey;
    padding: 10px;
}
</style>