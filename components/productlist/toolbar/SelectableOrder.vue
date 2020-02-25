<template>
    <div class="hbl-select">
        <select id="selectable-order" v-model="modelSelected" class="select-text" required>
            <option value="" disabled />
            <option v-for="(dataOption, index) in dataOptions" :key="index" :value="dataOption.option_id">
                {{ $t(dataOption.label) }}
            </option>
        </select>
        <span class="select-highlight" />
        <label for="selectable-order" class="select-label" v-text="$t('Sort by')" />
    </div>
</template>

<script>

export default {
    name: 'SelectableOrder',

    props: {
        dataOptions: {
            type: Array,
            required: true
        }
    },

    data() {
        return {
            name: 'SelectableOrder',
            modelSelected: null
        }
    },

    watch: {
        modelSelected(newValue, oldValue) {

            // send payload on to the bus ...
            this.$bus.$emit('selectable-order-changed', {
                payload: {
                    name: 'sort',
                    data: newValue
                }
            })
        }
    },

    created() {
        if(this.$route.query.order) {
            this.modelSelected = this.$route.query.order;
        }
    }
}
</script>
