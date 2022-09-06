<template>
    <h1 class="text-4xl mb-2" v-text="name" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, Ref } from 'vue'
import { useNuxtApp } from '#app'

const props = defineProps<{
    nameData: string
}>()

const name: Ref<string> = ref(props.nameData)

const { $hblBus } = useNuxtApp()
$hblBus.$on('productVariantChanged', eventListenerDetailName)

function eventListenerDetailName ({ data }) {
    // Override name data
    const { name: nameData } = data
    name.value = nameData
}

onBeforeUnmount(() => {
    $hblBus.$off('productVariantChanged', eventListenerDetailName)
})
</script>
