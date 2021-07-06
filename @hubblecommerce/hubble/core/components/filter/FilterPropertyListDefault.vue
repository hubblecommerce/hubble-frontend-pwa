<template>
    <div>
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

    computed: {
        ...mapState({
            properties: state => state.modFilter.properties,
            manufacturer: state => state.modFilter.manufacturer
        }),
    },

    methods: {
        getIsChecked(id) {
            return this[this.type] && this[this.type].includes(id);
        },
        onChangeOption(id) {
            const type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
            
            this.$store.commit(`modFilter/update${type}`, id);
        }
    }
}
</script>