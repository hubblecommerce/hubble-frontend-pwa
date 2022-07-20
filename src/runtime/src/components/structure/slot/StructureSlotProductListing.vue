<template>
    StructureSlotProductListing

    <ProductListing :data="content.productListing" />
</template>

<script setup lang="ts">
import { Slot } from '../../../../commons'

const props = defineProps<{
    content: Slot
}>()
</script>
