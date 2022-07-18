<template>
    StructureSlotCategoryNavigation
</template>

<script setup lang="ts">
import { Slot } from '../../../../commons'

const props = defineProps<{
    content: Slot
}>()
</script>
