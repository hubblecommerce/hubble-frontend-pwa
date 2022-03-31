<template>
    <div :class="[elementClass, { 'has-vertical-alignment': verticalAlign }]">
        <template v-if="verticalAlign">
            <h2 v-if="product" class="cms-element-alignment" :class="verticalAlign" v-text="product.name" />

            <div v-else class="cms-element-alignment" :class="verticalAlign" v-html="rawHtml" />
        </template>

        <template v-else>
            <h2 v-if="product" v-html="product.name" />

            <div v-else v-html="rawHtml" />
        </template>
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'ProductNameSlot',
    mixins: [slotMixins],

    computed: {
        rawHtml() {
            return this.content && this.content.data && this.content.data.content;
        },
        verticalAlign() {
            if (this.content.config && this.content.config.verticalAlign) {
                if (this.content.config.verticalAlign.value === 'center') {
                    return 'align-self-center';
                }
                if (this.content.config.verticalAlign.value === 'flex-end') {
                    return 'align-self-end';
                }
                if (this.content.config.verticalAlign.value === 'flex-start') {
                    return 'align-self-start';
                }
            }

            return '';
        },
    },
};
</script>

<style lang="scss">
.cms-element-product-name {
}
</style>
