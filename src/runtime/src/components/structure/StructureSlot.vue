<template>
    <div>
        Slot
        <pre>{{ content.data }}</pre>
    </div>
</template>

<script setup lang="ts">
import { Slot } from '../../../commons'

defineProps<{
    content: Slot
}>()
</script>
