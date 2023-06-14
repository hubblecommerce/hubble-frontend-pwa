<template>
    <div class="customer-orders-overview container mx-auto p-4 pb-12 lg:py-12">
        <div class="flex lg:items-center lg:mb-14">
            <h1 class="hidden text-4xl lg:block lg:mb-0 lg:mr-12">
                {{ t('customer.account.title') }}
            </h1>
        </div>

        <div class="flex flex-col items-start lg:flex-row gap-5 lg:gap-6 mb-5 lg:mb-16">
            <div class="w-full lg:w-1/2 lg:border lg:border-base-300 lg:rounded lg:bg-base-100 lg:pt-4 lg:px-6 lg:pb-7">
                <h3 class="mb-4 text-xl lg:font-medium lg:pt-3 lg:pb-5 lg:border-b lg:border-base-300 lg:mb-3">
                    {{ t('customer.account.personalTitle') }}
                </h3>
                <CustomerEditInfo />
            </div>

            <div class="w-full lg:w-1/2 lg:border  lg:border-base-300 lg:rounded lg:bg-base-100 lg:pt-4 lg:px-6 lg:pb-7">
                <h3 class="mb-4 text-xl lg:font-medium lg:pt-3 lg:pb-5 lg:border-b lg:border-base-300 lg:mb-3">
                    {{ t('customer.account.credentialsTitle') }}
                </h3>

                <div class="flex flex-col gap-3 p-4 lg:p-0 border lg:border-none rounded bg-base-100">
                    <CustomerEditEmail />
                    <CustomerEditPassword />
                </div>
            </div>
        </div>

        <CustomerEditNewsletter />
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { definePageMeta } from '#imports'

definePageMeta({
    middleware: ['auth']
})

const { t } = useI18n()
</script>

<i18n>
{
    "en": {
        "customer.account.title": "Account",
        "customer.account.personalTitle": "Personal data",
        "customer.account.credentialsTitle": "Login credentials"
    },
    "de": {
        "customer.account.title": "Accountverwaltung",
        "customer.account.personalTitle": "Persönliche Daten",
        "customer.account.credentialsTitle": "Login-Daten"
    }
}
</i18n>
