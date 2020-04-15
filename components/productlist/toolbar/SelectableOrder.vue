<template>
    <div class="hbl-select">
        <select id="selectable-order" v-model="modelSelected" class="select-text" required>
            <option value="" disabled></option>

            <option v-for="(dataOption, index) in dataOptions" :key="index" :value="dataOption.option_id">
                {{ $t(dataOption.label) }}
            </option>
        </select>

        <span class="select-highlight"></span>

        <label for="selectable-order" class="select-label" v-text="$t('Sort by')"></label>
    </div>
</template>

<script>
import {mapMutations, mapActions} from 'vuex';
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
        modelSelected: function(newValue) {
            this.setSelectedQueryParam({
                name: 'sort',
                data: newValue
            });
            this.applyFilter();
        }
    },

    created() {
        if(this.$route.query.sort) {
            this.modelSelected = this.$route.query.sort;
        }
    },

    methods: {
        ...mapMutations({
            setSelectedQueryParam: 'modApiRequests/setSelectedQueryParam',
        }),
        ...mapActions({
            applyFilter: 'modApiRequests/applyFilter',
        }),
    }
}
</script>
