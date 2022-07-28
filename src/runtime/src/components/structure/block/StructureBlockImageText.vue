<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <component :is="resolveComponent(`StructureSlot${toUpperCamelCase(leftSlot.type)}`)" :content="leftSlot.data" />
        </div>
        <div class="col-12 col-md-6">
            <component :is="resolveComponent(`StructureSlot${toUpperCamelCase(rightSlot.type)}`)" :content="rightSlot.data" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
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
