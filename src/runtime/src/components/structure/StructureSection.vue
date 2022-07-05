<template>
    <div>
        Section
        <StructureBlock v-for="(block) in content.blocks" :key="block.id" :content="block" />
    </div>
</template>

<script setup lang="ts">
import { Section } from '../../../commons'

defineProps<{
    count?: number
    content: Section
}>()
</script>

<style scoped>

</style>
