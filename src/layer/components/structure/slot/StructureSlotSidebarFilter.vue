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
import { type HblSlot } from '../../../types'

const props = defineProps<{
    content: HblSlot
}>()

const mounted = ref(false)
onMounted(() => {
    mounted.value = true
})
</script>
