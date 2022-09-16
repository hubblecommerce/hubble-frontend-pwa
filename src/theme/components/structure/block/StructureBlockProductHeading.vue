<template>
    <div class="flex flex-col md:flex-row md:justify-between">
        <component :is="resolveComponent(`StructureSlot${toUpperCamelCase(leftSlot.type)}`)" :content="leftSlot.data" />
        <component :is="resolveComponent(`StructureSlot${toUpperCamelCase(rightSlot.type)}`)" :content="rightSlot.data" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Slot, toUpperCamelCase } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    content: Slot[]
}>()

const leftSlot = computed(() => {
    return props.content.find(item => item.position === 'left')
})

const rightSlot = computed(() => {
    return props.content.find(item => item.position === 'right')
})
</script>
