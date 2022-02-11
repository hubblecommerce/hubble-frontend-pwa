<template>
    <div :class="elementClass">
        <div class="cms-element-alignment" :class="verticalAlign">
            <product-listing-card v-if="dataItem" :item-data="dataItem" />
        </div>
    </div>
</template>

<script>
import { slotMixins } from '../helper';
import { mappingProduct } from '@/utils/api-mapping-helper';

export default {
    name: 'ProductBoxSlot',
    mixins: [slotMixins],

    data() {
        return {
            dataItem: null,
            loaded: false,
        };
    },
    computed: {
        verticalAlign() {
            if (this.content.config && this.content.config.verticalAlign) {
                if (this.content.config.verticalAlign.value === 'center') {
                    return 'align-self-center';
                }
                if (this.content.config.verticalAlign.value === 'flex-end') {
                    return 'align-self-end';
                }
                if (this.content.config.verticalAlign.value === 'flex-end') {
                    return 'align-self-start';
                }
            }
            return '';
        },
    },

    mounted() {
        this.dataItem = mappingProduct({ product: this.content.data.product });
    },
};
</script>

<style lang="scss">
.cms-element-product-box {
    .product-card:hover {
        .card-expand {
            display: none;
        }
    }
}
</style>
