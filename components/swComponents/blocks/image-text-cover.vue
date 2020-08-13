<template>
    <div>
        <template v-if="!showCustomComponentInstead">
            <div class="col-md-6">
                <component :is="leftSlot" :content="getContentByPosition(content.slots, 'left')" />
            </div>
            <div class="col-md-6">
                <component :is="rightSlot" :content="getContentByPosition(content.slots, 'right')" />
            </div>
        </template>
         <div v-else>
            <custom-image-text-cover :content="content" />
         </div>
    </div>
</template>

<script>
    import { blockMixins } from '../helper'
    import { mapState } from "vuex";

    export default {
        name: 'ImageTextCoverBlock',

        components: {
            CustomImageTextCover: () => import("../custom-blocks/custom-image-text-cover"),
        },

        mixins: [blockMixins],

        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            ...mapState({
                showCustomComponentInstead: state => state.modCustomComponent.showCustomComponentInstead,
            }),
            leftSlot() {
                return this.getSlotByPosition(this.content.slots, 'left');
            },
            rightSlot() {
                return this.getSlotByPosition(this.content.slots, 'right');
            }
        }
    }
</script>
