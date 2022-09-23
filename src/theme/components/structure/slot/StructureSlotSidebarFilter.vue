<template>
    <Transition name="fade" mode="out-in">
        <div v-if="!mounted">
            <MiscSkeleton size="medium" :repeat="1" />
        </div>
        <div v-else>
            <portal-target name="productListingFilter" />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Slot } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    content: Slot
}>()

const mounted = ref(false)
onMounted(() => {
    mounted.value = true
})
</script>
