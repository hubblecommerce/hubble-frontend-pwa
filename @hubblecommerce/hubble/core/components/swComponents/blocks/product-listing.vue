<template>
    <div>
        <div class="col-12">
            <component :is="getSlot" :content="getContentByPosition(content.slots, 'content')" />
        </div>
    </div>
</template>

<script>
import { blockMixins } from '../helper';
import _ from 'lodash'
import { mapActions } from 'vuex'

export default {
    name: 'ProductListingBlock',

    mixins: [blockMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        getSlot() {
            return this.getSlotByPosition(this.content.slots, 'content');
        },
    },
    created() {
        let listingData = {};
        _.forEach(this.content.slots, slot => {
            if (slot.data && slot.data.apiAlias === 'cms_product_listing') {
                listingData = slot.data.listing;
            }
        });

        this.mapListingData({ listingData: listingData, query: this.$route.query });
    },

    methods: {
        ...mapActions({
            mapListingData: 'modApiCategory/mappingListingData',
        }),
    }
};
</script>

<style scoped></style>
