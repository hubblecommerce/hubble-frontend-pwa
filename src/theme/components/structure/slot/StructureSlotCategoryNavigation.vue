<template>
    StructureSlotCategoryNavigation
</template>

<script setup lang="ts">
import { Slot } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    content: Slot
}>()
</script>
