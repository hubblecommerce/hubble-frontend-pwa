<template>
    <div class="hbl-select limit">
        <select id="show" v-model="modelSelected" class="select-text" required>
            <option v-for="(option, index) in dataOptions" :key="index" :value="option.limit" v-text="$t(option.label)" />
        </select>
        <span class="select-highlight" />
        <label for="show" class="select-label" v-text="$t('Show')" />
    </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
export default {
    name: 'SelectableLimit',

    props: {
        dataOptions: {
            type: Array,
            required: true,
        },
        instantChange: {
            type: Boolean,
            required: false,
            default: true,
        },
    },

    data() {
        return {
            name: 'SelectableLimit',
            modelSelected: null,
        };
    },

    watch: {
        modelSelected(newValue) {
            this.setSelectedQueryParam({
                name: 'limit',
                data: newValue,
            });

            if (this.$route.query.limit !== newValue && this.instantChange) {
                this.applyFilter();
            }
        },
    },

    created() {
        if (this.$route.query.limit) {
            this.modelSelected = this.$route.query.limit;
        }
    },

    methods: {
        ...mapMutations({
            setSelectedQueryParam: 'modApiRequests/setSelectedQueryParam',
        }),
        ...mapActions({
            applyFilter: 'modApiRequests/applyFilter',
        }),
    },
};
</script>
