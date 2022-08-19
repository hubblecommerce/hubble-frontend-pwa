<template>
    <div class="flex flex-col gap-4">
        <div class="text-xl">
            Payment
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

            <div v-else-if="error || updateError">
                {{ error }}
                {{ updateError }}
            </div>

            <div v-else-if="paymentMethods != null" class="flex flex-col border border-base-300">
                <div v-for="(method, index) in paymentMethods" :key="method.id">
                    <label
                        :for="'payment-option-' + method.id"
                        :class="{ 'border-b border-base-300': index < paymentMethods.length - 1 }"
                        class="flex justify-between items-center p-4 cursor-pointer"
                    >
                        <input
                            :id="'payment-option-' + method.id"
                            v-model="selectedMethodId"
                            :value="method.id"
                            type="radio"
                            class="radio checked:bg-primary w-6 mr-4"
                            :disabled="updateLoading"
                        >
                        <div class="mr-auto">{{ method.name }}</div>
                    </label>
                    <div
                        v-show="selectedMethodId === method.id"
                        :class="index < paymentMethods.length - 1 ? 'border-b' : 'border-t'"
                        class="p-4 text-center bg-base-200 border-base-300"
                    >
                        {{ method.description }}
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch, ref } from 'vue'
import { useCheckout, usePlatform } from '#imports'

const { loading, error, paymentMethods, getPaymentMethods } = useCheckout()
const { error: updateError, loading: updateLoading, setPaymentMethod } = useCheckout()
const { session } = usePlatform()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
    (event: 'update-before:paymentMethod', id: string): void
    (event: 'update-after:paymentMethod', id: string): void
}>()

const selectedMethodId = ref(session.value.paymentMethod.id)

watch(selectedMethodId, async (value, oldValue) => {
    if (value !== oldValue) {
        emit('update-before:paymentMethod', value)
        await setPaymentMethod(value)
        emit('update-after:paymentMethod', value)
    }
})

onMounted(async () => {
    await nextTick(async () => {
        await getPaymentMethods()
    })
})
</script>
