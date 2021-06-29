<template>
    <div>
        <span v-if="selectedFiltersCount > 0">{{ selectedFiltersCount }} selected</span>
        
        <div v-for="option in options" :key="option.id">
            <label :for="'option-' + option.id">
                <input
                    :id="'option-' + option.id"
                    :checked="getIsChecked(option.id)"
                    type="checkbox"
                    @change="onChangeOption(option.id)"
                >
                {{ option.name }}
            </label>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

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
        }
    },

    data() {
        return {
            currentFilters: []
        }
    },

    computed: {
        ...mapState({
            properties: state => state.modFilter.properties,
            manufacturer: state => state.modFilter.manufacturer
        }),
        selectedFiltersCount() {
            return this.currentFilters.length;
        }
    },

    mounted() {
        this.getCurrentFilters();
    },

    methods: {
        getIsChecked(id) {
            return this[this.type] && this[this.type].includes(id);
        },
        getCurrentFilters() {
            this.currentFilters = this.options
                .filter(option => this.getIsChecked(option.id))
                .map(option => option.id);
        },
        onChangeOption(id) {
            const type = this.type.charAt(0).toUpperCase() + this.type.slice(1);

            if (this.currentFilters.includes(id)) {
                this.currentFilters = this.currentFilters.filter(v => v !== id)
            } else {
                this.currentFilters = [...this.currentFilters, id];
            }
            
            this.$store.commit(`modFilter/update${type}`, id);
        }
    }
}
</script>