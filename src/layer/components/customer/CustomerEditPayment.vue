<template>
    <div class="flex flex-col gap-6">
        <Transition name="fade" mode="out-in">
            <div v-if="loading || mounting" class="flex flex-col gap-4">
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

            <div v-else-if="paymentMethods != null" class="flex flex-col">
                <div
                    v-for="(method, index) in paymentMethods"
                    :key="index"
                    :class="{
                        'outline outline-2 outline-secondary rounded z-10 bg-base-200': method.id === selectedMethodId
                    }"
                    class="-mt-px border border-base-300"
                >
                    <label
                        :for="'payment-option-' + method.id"
                        class="flex justify-start items-center p-4 gap-6 cursor-pointer"
                    >
                        <input
                            :id="'payment-option-' + method.id"
                            v-model="selectedMethodId"
                            :value="method.id"
                            type="radio"
                            class="radio radio-secondary w-6 checked:border-2"
                            :disabled="updateLoading"
                        >
                        <img v-if="method.media" :src="method.media.url" :alt="method.media.alt" class="w-16">
                        <div class="w-full">
                            <div class="font-bold leading-6">{{ method.name }}</div>
                            <div class="text-sm text-base-700">{{ method.description }}</div>
                        </div>
                    </label>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useCheckout, useCustomer, useNotification } from '#imports'

const { loading, error, paymentMethods, getPaymentMethods } = useCheckout()
const customerStore = useCustomer()
const { customer } = storeToRefs(customerStore)
const { loading: updateLoading, editCustomerPayment } = customerStore
const mounting = ref(true)

const { showNotification } = useNotification()
const { t } = useI18n()

const selectedMethodId: Ref<string | undefined> = ref(customer?.value?.defaultPayment)

watch(selectedMethodId, async (value) => {
    try {
        if (typeof value !== 'undefined') {
            await editCustomerPayment(value)
            showNotification(t('customer.edit.payment.success'), 'success')
        }
    } catch (e) {
        // @ts-ignore
        showNotification(value.toString(), 'error', true)
    }
})

onMounted(async () => {
    mounting.value = false
    await getPaymentMethods()
})
</script>

<i18n>
{
    "en": {
        "customer.edit.payment.success": "Payment successfully saved."
    },
    "de": {
        "customer.edit.payment.success": "Bezahlungsart erfolgreich gespeichert."
    }
}
</i18n>
