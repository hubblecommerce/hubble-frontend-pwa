<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <component :is="resolveComponent(`StructureSlot${hblToUpperCamelCase(leftSlot.type)}`)" :content="leftSlot.data" />
        </div>
        <div class="col-12 col-md-6">
            <component :is="resolveComponent(`StructureSlot${hblToUpperCamelCase(rightSlot.type)}`)" :content="rightSlot.data" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import { type HblSlot } from '../../../types'
import { hblToUpperCamelCase } from '../../../utils/helper'

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
