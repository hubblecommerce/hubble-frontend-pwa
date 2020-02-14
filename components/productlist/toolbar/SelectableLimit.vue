<template>
    <div class="hbl-select limit">
        <select id="show"
                v-model="modelSelected"
                class="select-text"
                required
        >
            <option v-for="(option, index) in dataOptions" :key="index" :value="option.limit">
                {{ $t(option.label) }}
            </option>
        </select>
        <span class="select-highlight" />
        <label for="show" class="select-label" v-text="$t('Show')" />
    </div>
</template>

<script>
export default {
    name: 'SelectableLimit',

    props: {
        dataOptions: {
            type: Array,
            required: true
        }
    },

    data() {
        return {
            name: 'SelectableLimit',
            modelSelected: null
        }
    },

    watch: {
        modelSelected(newValue) {
            // send payload on to the bus ...
            this.$bus.$emit('selectable-limit-changed', {
                payload: {
                    name: 'limit',
                    data: newValue
                }
            })
        }
    },

    created() {
        if(this.$route.query.limit) {
            this.modelSelected = this.$route.query.limit;
        }
    }
}
</script>
