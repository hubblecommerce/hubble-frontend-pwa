<template>
    <div class="filter-pill">
        <template v-if="type === 'price'">
            <span>{{ minMaxPrice.min }} €</span>
            <span>-</span>
            <span>{{ minMaxPrice.max }} €</span>

            <button class="filter-pill__remove" @click="removePrice">
                <svg-icon icon="x" size="xs" />
            </button>
        </template>
        <template v-else>
            <span>{{ property.name }}</span>

            <button class="filter-pill__remove" @click="removeFilterOption">
                <svg-icon icon="x" size="xs" />
            </button>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        id: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        }
    },

    computed: {
        ...mapState({
            minMaxPrice: state => state.modFilter.minMaxPrice,
            aggregations: state => state.modFilter.aggregations,
        }),
        property() {
            let property = null;
            
            if (this.type === 'manufacturer') {
                property = this.aggregations.manufacturer.entities
                    .filter(v => v.id === this.id)[0];
            } else if (this.type === 'properties') {
                this.aggregations.properties.entities.forEach(ent => {
                    ent.options.forEach(opt => {
                        if (opt.id === this.id) property = opt;
                    });
                });
            }

            return property;
        }
    },

    methods: {
        removeFilterOption() {
            const type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
            this.$store.commit(`modFilter/update${type}`, this.id);
        },
        removePrice() {
            this.$store.commit('modFilter/updatePrice', {});
        }
    }
}
</script>

<style lang="scss">
.filter-pill {
    display: inline-block;
    background-color: lightgray;
    padding: 3px 8px;
    border-radius: 8px;

    &__remove {
        padding: 0;
        vertical-align: middle;
        background-color: inherit;

        &:hover {
            background-color: inherit;
        }
    }
}
</style>