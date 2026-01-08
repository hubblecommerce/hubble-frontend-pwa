<template>
    <div class="customer-addresses-overview container mx-auto p-4 pb-12 lg:py-12">
        <div class="flex lg:items-center lg:mb-14">
            <h1 class="hidden text-4xl lg:block lg:mb-0 lg:mr-12">
                {{ t('customer.account.title') }}
            </h1>
        </div>

        <div class="flex flex-col items-start lg:flex-row gap-5 lg:gap-6 mb-5 lg:mb-16">
            <div class="w-full lg:border lg:border-base-300 lg:rounded lg:bg-base-100 lg:pt-4 lg:px-6 lg:pb-7">
                <CustomerAddressBook>
                    <template #actions="actionProps">
                        <h3 class="flex justify-between items-center mb-6 lg:mb-8 text-xl lg:font-medium lg:pb-1 lg:border-b lg:border-base-300">
                            {{ t('customer.account.addressesTitle') }}
                            <span class="btn btn-ghost text-link -mr-3 lg:-mr-0" @click="actionProps.onAddAddress()">
                                <PlusCircleIcon class="w-5 h-5 mr-2 lg:fill-link" />
                                <span class="text-link">{{ t('customer.account.addresses.addAddressTitle') }}</span>
                            </span>
                        </h3>
                    </template>
                </CustomerAddressBook>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PlusCircleIcon } from '@heroicons/vue/20/solid'
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
        "customer.account.addressesTitle": "Addresses",
        "customer.account.addresses.addAddressTitle": "New address"
    },
    "de": {
        "customer.account.title": "Accountverwaltung",
        "customer.account.addressesTitle": "Adressen",
        "customer.account.addresses.addAddressTitle": "Neue Adresse"
    }
}
</i18n>
