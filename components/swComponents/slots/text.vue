<template>
    <div :class="elementClass">
        <div>
            <div class="" v-html="rawHtml"></div>
        </div>
    </div>
</template>

<script>
    import { slotMixins } from '../helper'

    export default {
        name: 'TextSlot',
        mixins: [slotMixins],
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            rawHtml() {
                return (
                    this.content &&
                    this.content.data &&
                    this.content.data.content
                );
            },
            verticalAlign() {
                return (
                    this.content &&
                    this.content.config &&
                    this.content.config.verticalAlign &&
                    this.content.config.verticalAlign.value
                );
            }
        }

    }
</script>

<style scoped>

</style>
