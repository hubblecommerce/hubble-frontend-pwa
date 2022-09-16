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
                        v-model="selectedMethodId"
                        :value="method.id"
                        type="radio"
                        class="radio checked:bg-primary w-6 mr-4"
                        :disabled="updateLoading"
                    >
                    <div class="mr-auto">{{ method.name }}</div>
                    <div v-if="method.price != null" class="whitespace-nowrap w-18 ml-4">
                        {{ method.price > 0 ? formatPrice(method.price) : 'free' }}
                    </div>
                </label>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useCheckout, useNotification, usePlatform } from '#imports'
import { useCurrency } from '@hubblecommerce/hubble/commons'

const { loading, error, shippingMethods, getShippingMethods } = useCheckout()
const { error: updateError, loading: updateLoading, setShippingMethod } = useCheckout()
const { session } = usePlatform()
const { formatPrice } = useCurrency()
const { showNotification } = useNotification()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
    (event: 'update-before:shippingMethod', id: string): void
    (event: 'update-after:shippingMethod', id: string): void
}>()

const selectedMethodId = ref(session.value.shippingMethod.id)

watch(selectedMethodId, async (value, oldValue) => {
    if (value !== oldValue && value !== null) {
        emit('update-before:shippingMethod', value)
        await setShippingMethod(value)
        emit('update-after:shippingMethod', value)
    }
})

watch(updateError, (value) => {
    if (value) {
        // Unselect option
        selectedMethodId.value = null
        showNotification(value.toString(), 'error', true)
    }
})

onMounted(async () => {
    await getShippingMethods()
})
</script>