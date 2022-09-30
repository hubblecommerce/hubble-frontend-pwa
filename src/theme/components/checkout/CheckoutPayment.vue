<template>
    <div>
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

                <div v-else-if="error">
                    {{ error }}
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
                            <div>{{ method.description }}</div>

                            <MiscPluginSlot
                                name="components-checkout-payment-method-description-after"
                                :events="slotEvents"
                                :data="{
                                    paymentMethods,
                                    method,
                                    selectedMethodId,
                                    showModal
                                }"
                            />
                        </div>
                    </div>
                </div>
            </Transition>
        </div>

        <template v-if="paymentMethods != null">
            <input id="payment-modal" v-model="showModal" type="checkbox" class="modal-toggle">
            <div class="modal">
                <div class="modal-box relative">
                    <MiscPluginSlot
                        name="components-checkout-payment-modal"
                        :events="slotEvents"
                        :data="{
                            paymentMethods,
                            selectedMethodId,
                            showModal
                        }"
                    />
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCheckout, useNotification, usePlatform } from '#imports'

const { loading, error, paymentMethods, getPaymentMethods } = useCheckout()
const { error: updateError, loading: updateLoading, setPaymentMethod } = useCheckout()
const platformStore = usePlatform()
const { session } = storeToRefs(platformStore)
const { showNotification } = useNotification()

const emit = defineEmits(['updateBefore:paymentMethod', 'updateAfter:paymentMethod'])

const selectedMethodId = ref(session.value.paymentMethod.id)
const showModal = ref(false)

const slotEvents = ref({
    'update:showModal': (bool) => { showModal.value = bool },
    'update:currentMethod': (data) => { selectedMethodId.value = data },
    'on:paymentError': (error) => { error.value = error }
})

watch(selectedMethodId, async (value, oldValue) => {
    if (value !== oldValue && value !== null) {
        emit('updateBefore:paymentMethod', value)
        await setPaymentMethod(value)
        emit('updateAfter:paymentMethod', value)
    }
})

watch(updateError, (value) => {
    if (value) {
        // Unselect options
        selectedMethodId.value = null
        showNotification(value.toString(), 'error', true)
    }
})

onMounted(async () => {
    await getPaymentMethods()
})
</script>
