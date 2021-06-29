<template>
    <div :class="elementClass">
        <product-listing-filter :aggregations="aggregations" />
    </div>
</template>

<script>
import { slotMixins } from '../helper';
import { mapState } from 'vuex';

export default {
    name: 'SidebarFilterSlot',

    mixins: [slotMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        ...mapState({
            aggregations: state => state.modFilter.aggregations
        })
    }
};
</script>
