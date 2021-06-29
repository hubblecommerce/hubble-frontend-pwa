<template>
    <div class="sorting-dropdown">
        <hbl-select>
            <select v-model="currentSorting" @change="onChangeSorting" class="select-text">
                <option v-for="sort in sortings" :key="sort._uniqueIdentifier" :value="sort.key">
                    {{ sort.label }}
                </option>
            </select>
        </hbl-select>
    </div>
</template>

<script>
export default {
    props: {
        sortings: {
            type: Array,
            default: () => []
        },
        sorting: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            currentSorting: this.sorting
        }
    },

    methods: {
        onChangeSorting() {
            this.$emit('onChangeSorting', this.currentSorting);
        }
    }
}
</script>

<style lang="scss">
.sorting-dropdown {
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    
    .hbl-select {
        margin-bottom: 0;
    }
}
</style>