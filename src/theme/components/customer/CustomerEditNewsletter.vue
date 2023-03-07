<template>
    <h4 class="mb-5 lg:mb-4">
        {{ t('customer.edit.newsletter.title') }}
    </h4>
    <div class="form-control mb-6">
        <label class="relative flex gap-4 items-center cursor-pointer">
            <input v-model="newsletterSubscription" type="checkbox" class="toggle toggle-primary">
            <span class="label-text text-base font-light leading-6">{{ t('customer.edit.newsletter.text') }}</span>
        </label>
    </div>
    <div v-if="loading" class="inline-flex py-2 px-3 border rounded border-base-700 bg-base-300">
        <ArrowPathIcon class="w-6 h-6 mr-4 animate-spin" />
        {{ t('customer.edit.newsletter.stateButtonLoading') }}
    </div>
</template>

<script setup lang="ts">
import { Ref, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useCustomer, useNotification, useRuntimeConfig } from '#imports'
const { t } = useI18n()

const customerStore = useCustomer()
const { customer } = storeToRefs(customerStore)
const { editCustomerNewsletter } = customerStore
const newsletterSubscription: Ref<boolean | null> = customer?.value?.newsletter != null ? ref(customer?.value.newsletter) : ref(null)
const config = useRuntimeConfig()
const { showNotification } = useNotification()
const loading = ref(false)

watch(newsletterSubscription, async (newVal) => {
    loading.value = true

    if (customer?.value?.email == null) {
        return
    }

    const requestBody = {
        email: customer.value.email,
        option: newVal ? 'direct' : 'unsubscribe',
        storefrontUrl: config.public.platformBaseUrl
    }

    try {
        await editCustomerNewsletter(requestBody)
        showNotification(newVal ? t('customer.edit.newsletter.subscribe.success') : t('customer.edit.newsletter.unsubscribe.success'), 'success')
        loading.value = false
    } catch (e) {
        // @ts-ignore
        if (e.body != null) {
            // @ts-ignore
            e.body.forEach((error) => {
                if (error.detail != null) {
                    showNotification(error.detail, 'error', true)
                }
            })
        } else {
            showNotification(t('customer.edit.newsletter.error'), 'error', true)
        }
        loading.value = false
    }
})
</script>

<i18n>
{
    "en": {
        "customer.edit.newsletter.title": "Newsletter Settings",
        "customer.edit.newsletter.text": "Yes, I would like to receive the newsletter. You can unsubscribe at any time!",
        "customer.edit.newsletter.stateButtonLoading": "Settings are applied...",
        "customer.edit.newsletter.subscribe.success": "Registration for the newsletter successful.",
        "customer.edit.newsletter.unsubscribe.success": "Successfully unsubscribed from the newsletter.",
        "customer.edit.newsletter.error": "Something went wrong. Please try again later."
    },
    "de": {
        "customer.edit.newsletter.title": "Ihre Newslettereinstellungen",
        "customer.edit.newsletter.text": "Ja, ich möchte den Newsletter erhalten. Sie können sich jederzeit wieder abmelden!",
        "customer.edit.newsletter.stateButtonLoading": "Einstellungen werden übernommen...",
        "customer.edit.newsletter.subscribe.success": "Anmeldung zum Newsletter erfolgreich.",
        "customer.edit.newsletter.unsubscribe.success": "Erfolgreich aus dem Newsletter ausgetragen.",
        "customer.edit.newsletter.error": "Es ist etwas schief gelaufen. Bitte versuchen Sie es später noch einmal."
    }
}
</i18n>
