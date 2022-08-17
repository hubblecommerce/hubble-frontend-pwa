<template>
    <div class="flex flex-col gap-4">
        <div class="text-xl">
            Shipping
        </div>

        <Transition name="fade" mode="out-in">
            <div v-if="loading" class="flex flex-col gap-4">
                <div class="flex gap-4">
                    <MiscSkeleton circle size="large" />
                    <MiscSkeleton text size="large" />
                </div>
                <div class="flex gap-4">
                    <MiscSkeleton circle size="large" />
                    <MiscSkeleton text size="large" />
                </div>
                <div class="flex gap-4">
                    <MiscSkeleton circle size="large" />
                    <MiscSkeleton text size="large" />
                </div>
            </div>

            <div v-else-if="error">
                {{ error }}
            </div>

            <div v-else-if="shippingMethods != null" class="flex flex-col border border-base-300">
                <label
                    v-for="(method, index) in shippingMethods"
                    :key="method.id"
                    :for="'shipping-option-' + method.id"
                    :class="{ 'border-b border-base-300': index < shippingMethods.length - 1 }"
                    class="flex justify-between items-center p-4 cursor-pointer"
                >
                    <input
                        :id="'shipping-option-' + method.id"
                        v-model="selectedMethod"
                        :value="method.id"
                        type="radio"
                        class="radio checked:bg-primary w-6 mr-4"
                    >
                    <div class="mr-auto">{{ method.name }}</div>
                    <div class="whitespace-nowrap w-18 ml-4">{{ method.price }}</div>
                </label>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref } from 'vue'
import { useCheckout } from '#imports'

const { loading, error, shippingMethods, getShippingMethods } = useCheckout()

const selectedMethod = ref()

onMounted(async () => {
    await nextTick(async () => {
        await getShippingMethods()
    })
})
</script>
