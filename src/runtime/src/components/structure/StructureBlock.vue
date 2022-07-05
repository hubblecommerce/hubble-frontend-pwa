<template>
    <div>
        Block
        <StructureSlot v-for="slot in content.slots" :key="slot.id" :content="slot" />
    </div>
</template>

<script setup lang="ts">
import { Block } from '../../../commons'

defineProps<{
    content: Block
}>()
</script>
