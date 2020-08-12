<template>
    <div class="customImageTextCoverBox">
        <component :is="leftSlot" :content="getContentByPosition(content.slots, 'left')" />

        <component :is="rightSlot" :content="getContentByPosition(content.slots, 'right')" />
    </div>
</template>

<script>
    import { blockMixins } from '../helper'

    export default {
        name: 'CustomImageTextCover',

        mixins: [blockMixins],

        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            leftSlot() {
                return this.getSlotByPosition(this.content.slots, 'left');
            },
            rightSlot() {
                return this.getSlotByPosition(this.content.slots, 'right');
            }
        }
    }
</script>
