<template>
    <div>
        <div class="flex flex-col gap-4">
            <div class="text-xl">
                {{ t('checkout.payment.headline') }}
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
                            class="p-4 bg-base-200 border-base-300"
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
                <label class="modal-backdrop cursor-pointer" for="payment-modal">Close</label>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useNuxtApp } from '#imports'
import { useCheckout, useNotification, usePlatform } from '#imports'

const { t } = useI18n()
const { $hblBus } = useNuxtApp()
const { loading, error, paymentMethods, getPaymentMethods } = useCheckout()
const { error: updateError, loading: updateLoading, setPaymentMethod } = useCheckout()
const platformStore = usePlatform()
const { session } = storeToRefs(platformStore)
const { showNotification } = useNotification()

const emit = defineEmits(['updateBefore:paymentMethod', 'updateAfter:paymentMethod'])

const props = defineProps({
    currentStep: {
        type: String,
        default: ''
    }
})

const selectedMethodId: Ref<string | null> = session?.value?.paymentMethod?.id != null ? ref(session?.value?.paymentMethod?.id) : ref(null)
const showModal = ref(false)

const slotEvents = ref({
    'update:showModal': (bool: boolean) => { showModal.value = bool },
    'update:currentMethod': (data: string) => { selectedMethodId.value = data },
    'on:paymentError': (error: any) => { error.value = error }
})

watch(selectedMethodId, async (value, oldValue) => {
    if (value !== oldValue && value != null) {
        emit('updateBefore:paymentMethod', value)
        await setPaymentMethod(value)
        if (!updateError.value) {
            $hblBus.$emit('selectPaymentMethod', { payment: paymentMethods?.value?.find(method => method.id === value) })
        }
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

watch(() => props.currentStep, (value) => {
    if (value === 'payment') {
        $hblBus.$emit('selectPaymentMethod', { payment: paymentMethods?.value?.find(method => method.id === selectedMethodId.value) })
    }
})

onMounted(async () => {
    await getPaymentMethods()
})
</script>

<i18n>
{
    "en": {
        "checkout.payment.headline": "Payment"
    },
    "de": {
        "checkout.payment.headline": "Bezahlung"
    }
}
</i18n>
