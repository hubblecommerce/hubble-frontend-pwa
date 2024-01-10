<template>
    <div class="container m-auto p-10">
        <div
            class="flex justify-center"
        >
            <div v-if="emailConfirmed" class="flex gap-2">
                <CheckCircleIcon class="w-6 h-6" />
                <div>
                    {{ t('newsletter.confirm.success') }}
                </div>
            </div>
            <div v-else class="flex gap-2">
                <XCircleIcon class="w-6 h-6" />
                <div>
                    {{ t('newsletter.confirm.error') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { useAsyncData, useRouter, useCustomer } from '#imports'

const customerStore = useCustomer()
const { confirmCustomerNewsletter } = customerStore

const { t } = useI18n()

const { currentRoute } = useRouter()
const em = currentRoute?.value?.query?.em
const hash = currentRoute?.value?.query?.hash

const emailConfirmed = ref(false)

if (em && hash) {
    const formData = {
        em,
        hash
    }

    // @ts-ignore
    const { error } = await useAsyncData(() => confirmCustomerNewsletter(formData))

    if (!error.value) {
        emailConfirmed.value = true
    }
}
</script>
<i18n>
{
    "en": {
        "newsletter.confirm.error": "Unfortunately, we could not confirm your subscription to the newsletter. Please make sure that the registration link is correct.",
        "newsletter.confirm.success": "You have successfully subscribed to our newsletter."
    },
    "de": {
        "newsletter.confirm.error": "Wir konnten ihre Anmeldung zum Newsletter leider nicht bestätigen. Bitte stellen Sie sicher, dass der Link zur Anmeldung richtig ist.",
        "newsletter.confirm.success": "Sie haben sich erfolgreich zu unserem Newsletter angemeldet."
    }
}
</i18n>
