<template>
    <div class="flex flex-col lg:flex-row gap-7 w-full">
        <div class="w-full">
            <div>
                <component :is="resolveComponent(`StructureSlot${hblToUpperCamelCase(leftSlotImage.type)}`)" :content="leftSlotImage.data" />
            </div>
            <div>
                <component :is="resolveComponent(`StructureSlot${hblToUpperCamelCase(leftSlotText.type)}`)" :content="leftSlotText" />
            </div>
        </div>
        <div class="w-full">
            <div>
                <component :is="resolveComponent(`StructureSlot${hblToUpperCamelCase(centerSlotImage.type)}`)" :content="centerSlotImage.data" />
            </div>
            <div>
                <component :is="resolveComponent(`StructureSlot${hblToUpperCamelCase(centerSlotText.type)}`)" :content="centerSlotText" />
            </div>
        </div>
        <div class="w-full">
            <div>
                <component :is="resolveComponent(`StructureSlot${hblToUpperCamelCase(rightSlotImage.type)}`)" :content="rightSlotImage.data" />
            </div>
            <div>
                <component :is="resolveComponent(`StructureSlot${hblToUpperCamelCase(rightSlotText.type)}`)" :content="rightSlotText" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import { HblSlot } from '@/utils/types'
import { hblToUpperCamelCase } from '@/utils/helper'

const props = defineProps<{
    content: HblSlot[]
}>()

const leftSlotImage = computed(() => {
    return props.content.find(item => item.position === 'left-image')
})

const leftSlotText = computed(() => {
    return props.content.find(item => item.position === 'left-text')
})

const centerSlotImage = computed(() => {
    return props.content.find(item => item.position === 'center-image')
})

const centerSlotText = computed(() => {
    return props.content.find(item => item.position === 'center-text')
})

const rightSlotImage = computed(() => {
    return props.content.find(item => item.position === 'right-image')
})

const rightSlotText = computed(() => {
    return props.content.find(item => item.position === 'right-text')
})

</script>
