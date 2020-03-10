<template>
    <div>
        <div class="col-12">
            <component :is="getSlot" :content="getContentByPosition(content.slots, 'image')" />
        </div>
    </div>
</template>

<script>
    import { blockMixins } from '../helper'

    export default {
        name: 'ImageCoverBlock',

        mixins: [blockMixins],

        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            getSlot() {
                return this.getSlotByPosition(this.content.slots, 'image');
            }
        }
    }
</script>

<style scoped>

</style>
