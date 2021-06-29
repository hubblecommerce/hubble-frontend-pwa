<template>
    <div class="filter-property">
        <div class="filter-property__trigger" @click="collapsed = !collapsed">
            <span v-text="name" />
        </div>

        <transition name="fade">
            <filter-property-list
                v-if="collapsed"
                :options="options"
                :type="type"
                :price="price" />
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: '',
            required: true,
        },
        options: {
            type: Array,
            default: () => ([]),
        },
        type: {
            type: String,
            default: '',
            required: true,
        },
        price: {
            type: Object,
            default: () => ({}),
        }
    },

    data() {
        return {
            collapsed: false
        }
    }
}
</script>

<style lang="scss">
.filter-property {
    position: relative;
}
</style>