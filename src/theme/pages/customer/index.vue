<template>
    <div class="customer-orders-overview container mx-auto p-4 pb-12 lg:py-12">
        <div class="flex lg:items-center lg:mb-14">
            <h1 class="lg:mb-0 lg:mr-12">
                {{ t('customer.account.title') }}
            </h1>
        </div>

        <div class="lg:border lg:rounded lg:bg-base-100 lg:pt-4 lg:px-6 lg:pb-7">
            <h3 class="mb-4 lg:text-lg lg:font-medium lg:mb-0">
                {{ t('customer.orders.title') }}
            </h3>
            <CustomerOrdersList />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { definePageMeta } from '#imports'

const { t } = useI18n()

definePageMeta({
    middleware: ['auth']
})
</script>

<i18n>
{
    "en": {
        "customer.account.title": "Account",
        "customer.orders.title": "Orders"
    },
    "de": {
        "customer.account.title": "Accountverwaltung",
        "customer.orders.title": "Bestellungen"
    }
}
</i18n>
