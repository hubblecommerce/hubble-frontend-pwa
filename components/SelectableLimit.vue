<template>
    <div class="hbl-select limit">
        <select id="show" class="select-text" required v-model="modelSelected">
            <option value="" disabled></option>
            <option v-for="(option, index) in dataOptions" :key="index" :value="option.limit">
                {{ option.label }}
            </option>
        </select>
        <span class="select-highlight"></span>
        <label for="show" class="select-label" v-text="$t('Show')"></label>
    </div>
</template>

<script>
export default {

    data() {
        return {
            name: 'SelectableLimit',
            modelSelected: null
        }
    },

    props: {
        dataOptions: {
            type: Array,
            required: true
        }
    },

    created() {
        if(this.$route.query.limit) {
            this.modelSelected = this.$route.query.limit;
        }
    },

    watch: {
        modelSelected(newValue, oldValue) {
            // send payload on to the bus ...
            this.$bus.$emit('selectable-limit-changed', {
                payload: {
                    name: 'limit',
                    data: newValue
                }
            })
        }
    }
}
</script>
