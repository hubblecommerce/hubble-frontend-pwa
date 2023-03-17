<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-7">
            <component :is="resolveComponent(`StructureSlot${toUpperCamelCase(leftSlot.type)}`)" :content="leftSlot.data" />
        </div>
        <div class="col-span-12 lg:col-span-5">
            <component :is="resolveComponent(`StructureSlot${toUpperCamelCase(rightSlot.type)}`)" :content="rightSlot.data" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HblSlot } from '@/utils/types'
import { toUpperCamelCase } from '@hubblecommerce/hubble/commons'

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
