<template>
    <template v-if="loading">
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
        class="relative col-span-2 md:col-span-1 border p-4"
    >
        <div
            v-if="address.id === customer.billingAddress?.id || address.id === customer.shippingAddress?.id"
            class="absolute -top-2 badge badge-sm badge-primary"
        >
            Default {{ address.id === customer.billingAddress?.id ? 'Billing' : '' }} {{ address.id === customer.shippingAddress?.id ? 'Shipping' : '' }}
        </div>
        <CustomerAddressRenderer :address="address" />
        <div class="flex space-x-2">
            <span class="link-secondary link-hover cursor-pointer" @click="onEditAddress(address.id)">Edit</span>
            <span class="link-secondary link-hover cursor-pointer" @click="onDeleteAddress(address.id)">Delete</span>
        </div>
    </div>
    <div v-else-if="error">
        {{ error }}
    </div>

    <div class="col-span-2 md:col-span-1 btn btn-primary" @click="onAddAddress()">
        Add new Address
    </div>

    <input id="address-form-modal" v-model="modalState" type="checkbox" class="modal-toggle">
    <label for="address-form-modal" class="modal modal-bottom sm:modal-middle cursor-pointer">
        <label class="modal-box relative" for="">
            <div class="btn btn-sm btn-circle absolute right-2 top-2" @click="modalState = false">
                <XMarkIcon class="h-4 w-4" />
            </div>
            <div class="text-2xl mb-2">{{ formAction }} Address</div>
            <form ref="addressBookForm" class="w-full relative flex flex-col" @submit.prevent="onFormSubmit()">
                <CustomerAddressForm v-if="formAction === 'Add' || formAction === 'Edit'" :model-value="formData" />
                <CustomerAddressRenderer v-if="formAction === 'Delete'" :address="formData" />
                <div v-if="formAction === 'Add' || formAction === 'Edit'" class="form-control mt-4">
                    <label for="useDefaultBilling" class="label justify-start cursor-pointer">
                        <input id="useDefaultBilling" v-model="useAsDefaultBilling" type="checkbox" class="checkbox mr-2">
                        <span class="label-text">Use as default billing address</span>
                    </label>
                </div>
                <div v-if="formAction === 'Add' || formAction === 'Edit'" class="form-control">
                    <label for="useDefaultShipping" class="label justify-start cursor-pointer">
                        <input id="useDefaultShipping" v-model="useAsDefaultShipping" type="checkbox" class="checkbox mr-2">
                        <span class="label-text">Use as default shipping address</span>
                    </label>
                </div>
                <button
                    type="submit"
                    :class="{ 'loading': addLoading | updateLoading | deleteLoading }"
                    :disabled="(addLoading | updateLoading | deleteLoading)"
                    class="btn btn-primary text-right mt-4"
                    @click.prevent="onFormSubmit()"
                >
                    {{ formAction }} Address
                </button>
            </form>
        </label>
    </label>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { onMounted, nextTick, ref, Ref, watch } from 'vue'
import { CustomerBillingAddress, CustomerShippingAddress, useForm } from '@hubblecommerce/hubble/commons'
import { useCustomer, useNotification } from '#imports'

/*
 * Fetch Addresses
 */
const loading: Ref<boolean> = ref(true)
const addresses: Ref<null | CustomerBillingAddress[] | CustomerShippingAddress[]> = ref(null)
const { customer, getCustomerAddresses, getCustomer, error } = useCustomer()
onMounted(async () => {
    await nextTick(async () => {
        try {
            addresses.value = await getCustomerAddresses()
        } catch (e) {} finally {
            loading.value = false
        }
    })
})

/*
 * Handle address actions
 */
const modalState: Ref<boolean> = ref(false)
const formData: Ref<CustomerBillingAddress | CustomerShippingAddress | Record<string, never>> = ref({})
const formAction: Ref<null | 'Add' | 'Edit' | 'Delete'> = ref(null)
const { validateForm } = useForm()
const addressBookForm = ref()
const { showNotification } = useNotification()
const useAsDefaultBilling = ref(false)
const useAsDefaultShipping = ref(false)

const { addCustomerAddress, loading: addLoading, error: addError } = useCustomer()
function onAddAddress () {
    formAction.value = 'Add'
    formData.value = {}
    modalState.value = true
}

const { updateCustomerAddress, loading: updateLoading, error: updateError } = useCustomer()
function onEditAddress (id: string) {
    formAction.value = 'Edit'
    formData.value = Object.assign({}, addresses.value.find(address => address.id === id))
    modalState.value = true
}

const { deleteCustomerAddress, loading: deleteLoading, error: deleteError } = useCustomer()
function onDeleteAddress (id: string) {
    formAction.value = 'Delete'
    formData.value = Object.assign({}, addresses.value.find(address => address.id === id))
    modalState.value = true
}

const { setDefaultBilling, setDefaultShipping, error: defaultError } = useCustomer()
async function onFormSubmit () {
    const isValid = await validateForm(addressBookForm.value)
    let response = null

    if (isValid) {
        if (formAction.value === 'Edit') {
            response = await updateCustomerAddress(formData.value as CustomerShippingAddress | CustomerBillingAddress)

            if (updateError.value) {
                showNotification(updateError.value as string, 'error', true)
                return
            }
        }

        if (formAction.value === 'Add') {
            response = await addCustomerAddress(formData.value as CustomerShippingAddress | CustomerBillingAddress)

            if (addError.value) {
                showNotification(addError.value as string, 'error', true)
                return
            }
        }

        if (formAction.value === 'Delete') {
            await deleteCustomerAddress(formData.value.id)

            if (deleteError.value) {
                showNotification(deleteError.value as string, 'error', true)
                return
            }
        }

        if (useAsDefaultBilling.value && response != null) {
            await setDefaultBilling(response.id)
        }

        if (useAsDefaultShipping.value && response != null) {
            await setDefaultShipping(response.id)
        }

        if (defaultError.value) {
            showNotification(defaultError.value as string, 'error', true)
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
