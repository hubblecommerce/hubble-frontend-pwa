<template>
    <slot name="actions" :on-add-address="onAddAddress" />

    <div class="grid gird-cols-1 lg:grid-cols-4 gap-2 lg:gap-6">
        <template v-if="loading && addresses == null">
            <div class="col-span-2 md:col-span-1 grid gap-2">
                <MiscSkeleton size="small" :repeat="5" />
            </div>
            <div class="col-span-2 md:col-span-1 grid gap-2">
                <MiscSkeleton size="small" :repeat="5" />
            </div>
        </template>
        <div
            v-for="address in addresses"
            v-else-if="addresses != null"
            :key="address.id"
            class="relative col-span-2 md:col-span-1 border border-base-300 p-4"
        >
            <div
                v-if="address.id === customer?.billingAddress?.id || address.id === customer?.shippingAddress?.id"
                class="absolute -top-2 badge badge-sm badge-primary"
            >
                {{ t('customer.address.book.default') }} {{ address.id === customer?.billingAddress?.id ? t('customer.address.book.billing') : '' }} {{ address.id === customer?.shippingAddress?.id ? t('customer.address.book.shipping') : '' }}
            </div>
            <CustomerAddressRenderer :address="address" />
            <div class="flex space-x-2">
                <span class="link-secondary link-hover cursor-pointer" @click="onEditAddress(address.id)">{{ t('customer.address.book.edit') }}</span>
                <span class="link-secondary link-hover cursor-pointer" @click="onDeleteAddress(address.id)">{{ t('customer.address.book.delete') }}</span>
            </div>
        </div>
        <div v-else-if="error">
            {{ error }}
        </div>
    </div>

    <input id="address-form-modal" v-model="modalState" type="checkbox" class="modal-toggle">
    <div class="modal modal-top sm:modal-middle">
        <div class="modal-box relative">
            <div class="btn btn-sm btn-circle absolute right-2 top-2" @click="modalState = false">
                <XMarkIcon class="h-4 w-4" />
            </div>
            <div class="text-2xl mb-2">
                {{ t(`customer.address.book.action${formAction}`) }} {{ t('customer.address.book.address') }}
            </div>
            <form ref="addressBookForm" class="w-full relative flex flex-col" @submit.prevent="onFormSubmit()">
                <CustomerAddressForm v-if="formAction === 'Add' || formAction === 'Edit'" :model-value="formData" />
                <CustomerAddressRenderer v-if="formAction === 'Delete'" :address="formData" />
                <fieldset v-if="formAction === 'Add' || formAction === 'Edit'" class="fieldset mt-4">
                    <input id="useDefaultBilling" v-model="useAsDefaultBilling" type="checkbox" class="checkbox mr-2">
                    <label for="useDefaultBilling" class="label justify-start cursor-pointer">
                        {{ t('customer.address.book.defaultBillingAction') }}
                    </label>
                </fieldset>
                <fieldset v-if="formAction === 'Add' || formAction === 'Edit'" class="fieldset">
                    <input id="useDefaultShipping" v-model="useAsDefaultShipping" type="checkbox" class="checkbox mr-2">
                    <label for="useDefaultShipping" class="label justify-start cursor-pointer">
                        {{ t('customer.address.book.defaultShippingAction') }}
                    </label>
                </fieldset>
                <button
                    type="submit"
                    :class="{ 'loading': loading }"
                    :disabled="(loading)"
                    class="btn btn-primary text-right mt-4"
                    @click.prevent="onFormSubmit()"
                >
                    {{ t(`customer.address.book.action${formAction}`) }} {{ t('customer.address.book.address') }}
                </button>
            </form>
        </div>
        <label class="modal-backdrop cursor-pointer" for="address-form-modal">Close</label>
    </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { ref, type Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { type HblCustomerBillingAddress, type HblCustomerShippingAddress } from '@/utils/types'
import { hblUseForm } from '@/utils/helper'
import { useCustomer, useNotification } from '#imports'

const { t } = useI18n()

/*
 * Fetch Addresses
 */
const customerStore = useCustomer()
const { customer, error, loading } = storeToRefs(customerStore)
const {
    getCustomerAddresses,
    getCustomer,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultBilling,
    setDefaultShipping
} = customerStore
const addresses: Ref<null | HblCustomerBillingAddress[] | HblCustomerShippingAddress[]> = ref(await getCustomerAddresses())

/*
 * Handle address actions
 */
const modalState: Ref<boolean> = ref(false)
const formData: Ref<HblCustomerBillingAddress | HblCustomerShippingAddress | Record<string, never>> = ref({})
const formAction: Ref<null | 'Add' | 'Edit' | 'Delete'> = ref(null)
const { validateForm } = hblUseForm()
const addressBookForm = ref()
const { showNotification } = useNotification()
const useAsDefaultBilling = ref(false)
const useAsDefaultShipping = ref(false)

function onAddAddress () {
    formAction.value = 'Add'
    formData.value = {}
    modalState.value = true
}

function onEditAddress (id: string) {
    formAction.value = 'Edit'
    formData.value = Object.assign({}, addresses?.value?.find(address => address.id === id))
    modalState.value = true
}

function onDeleteAddress (id: string) {
    formAction.value = 'Delete'
    formData.value = Object.assign({}, addresses?.value?.find(address => address.id === id))
    modalState.value = true
}

async function onFormSubmit () {
    const isValid = await validateForm(addressBookForm.value)
    let response = null

    if (isValid) {
        if (formAction.value === 'Edit') {
            response = await updateCustomerAddress(formData.value as HblCustomerShippingAddress | HblCustomerBillingAddress)

            if (error.value) {
                showNotification(error.value as string, 'error', true)
                return
            }
        }

        if (formAction.value === 'Add') {
            response = await addCustomerAddress(formData.value as HblCustomerShippingAddress | HblCustomerBillingAddress)

            if (error.value) {
                showNotification(error.value as string, 'error', true)
                return
            }
        }

        if (formAction.value === 'Delete') {
            await deleteCustomerAddress(formData.value.id)

            if (error.value) {
                showNotification(error.value as string, 'error', true)
                return
            }
        }

        if (useAsDefaultBilling.value && response != null) {
            await setDefaultBilling(response.id)
        }

        if (useAsDefaultShipping.value && response != null) {
            await setDefaultShipping(response.id)
        }

        if (error.value) {
            showNotification(error.value as string, 'error', true)
            return
        }

        modalState.value = false
        loading.value = true
        addresses.value = await getCustomerAddresses()
        await getCustomer()
        loading.value = false
    }
}

watch(modalState, (value) => {
    if (!value) {
        formAction.value = null
        useAsDefaultBilling.value = false
        useAsDefaultShipping.value = false
        formData.value = {}
    }
})
</script>

<i18n>
{
    "en": {
        "customer.address.book.default": "Default",
        "customer.address.book.billing": "Billing",
        "customer.address.book.shipping": "Shipping",
        "customer.address.book.edit": "Edit",
        "customer.address.book.delete": "Delete",
        "customer.address.book.address": "Address",
        "customer.address.book.defaultBillingAction": "Use as default billing address",
        "customer.address.book.defaultShippingAction": "Use as default shipping address",
        "customer.address.book.actionAdd": "Add",
        "customer.address.book.actionEdit": "Edit",
        "customer.address.book.actionDelete": "Delete",
        "customer.address.book.actionnull": ""
    },
    "de": {
        "customer.address.book.default": "Standard",
        "customer.address.book.billing": "Rechnungsadresse",
        "customer.address.book.shipping": "Versandadresse",
        "customer.address.book.edit": "Bearbeiten",
        "customer.address.book.delete": "Löschen",
        "customer.address.book.address": "Adresse",
        "customer.address.book.defaultBillingAction": "Als standard Rechnungsadresse verwenden",
        "customer.address.book.defaultShippingAction": "Als standard Versandadresse verwenden",
        "customer.address.book.actionAdd": "Hinzufügen",
        "customer.address.book.actionEdit": "Bearbeiten",
        "customer.address.book.actionDelete": "Löschen",
        "customer.address.book.actionnull": ""
    }
}
</i18n>
