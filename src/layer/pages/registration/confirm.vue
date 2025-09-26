<template>
    <div class="container m-auto p-10">
        <div class="flex justify-center">
            <div v-if="loading" class="flex gap-2">
                <ArrowPathIcon class="w-6 h-6 mr-4 animate-spin" />
            </div>
            <div v-if="confirmationFailed" class="flex gap-2">
                <XCircleIcon class="w-6 h-6" />
                <div>
                    {{ t('registration.confirm.error') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { XCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useRouter, useCustomer, useLocalisation, useNotification, usePlatform } from '#imports'

const customerStore = useCustomer()
const { registerConfirm } = customerStore

const { t } = useI18n()
const { navigateToI18n } = useLocalisation()

const platformStore = usePlatform()
const { getSession } = platformStore

const { showNotification } = useNotification()

const { currentRoute } = useRouter()
const em = currentRoute?.value?.query?.em
const hash = currentRoute?.value?.query?.hash

const loading = ref(true)
const confirmationFailed = ref(false)

onMounted(async function () {
    if (em && hash) {
        const formData = {
            em,
            hash
        }

        try {
            // @ts-ignore
            await registerConfirm(formData)

            await getSession()
            showNotification(t('registration.confirm.success'), 'success')
            await navigateToI18n('/customer')
            loading.value = false
        } catch (e) {
            loading.value = false
            confirmationFailed.value = true
        }
    } else {
        showNotification(t('registration.confirm.error'), 'error')
        await navigateToI18n('/customer/login')
    }
})
</script>
<i18n>
{
    "en": {
        "registration.confirm.error": "Unfortunately, we could not confirm your registration. Please make sure that the registration link is correct.",
        "registration.confirm.success": "You have successfully registered."
    },
    "de": {
        "registration.confirm.error": "Wir konnten ihre Anmeldung leider nicht bestätigen. Bitte stellen Sie sicher, dass der Link zur Anmeldung richtig ist.",
        "registration.confirm.success": "Sie haben sich erfolgreich registriert."
    }
}
</i18n>
