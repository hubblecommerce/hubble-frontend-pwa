<template>
    <div :class="[elementClass, { 'has-vertical-alignment': verticalAlign }]">
        <template v-if="verticalAlign">
            <h2 v-if="hasProductDataMapping" class="cms-element-alignment" :class="verticalAlign" v-text="content.data.content" />

            <div v-else class="cms-element-alignment" :class="verticalAlign" v-html="rawHtml" />
        </template>

        <template v-else>
            <h2 v-if="hasProductDataMapping" v-text="content.data.content" />

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
        hasProductDataMapping() {
            return this.content && this.content.config && this.content.config.content && this.content.config.content.source === 'mapped';
        },
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
