<template>
    <div class="flex flex-col md:flex-row md:justify-between">
        <component :is="resolveComponent(`StructureSlot${hblToUpperCamelCase(leftSlot.type)}`)" :content="leftSlot.data" />
        <component :is="resolveComponent(`StructureSlot${hblToUpperCamelCase(rightSlot.type)}`)" :content="rightSlot.data" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HblSlot } from '@/utils/types'
import { hblToUpperCamelCase } from '@/utils/helper'

const props = defineProps<{
    content: HblSlot[]
}>()

const leftSlot = computed(() => {
    return props.content.find(item => item.position === 'left')
})

const rightSlot = computed(() => {
    return props.content.find(item => item.position === 'right')
})
</script>
