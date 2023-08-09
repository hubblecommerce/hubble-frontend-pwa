<template>
    <form ref="personalForm" class="grid grid-cols-12 gap-3 p-4 lg:p-0 border lg:border-none rounded bg-base-100" @submit.prevent="onSubmitPersonalForm()">
        <div class="form-control col-span-12 lg:col-span-6">
            <label for="salutation" class="label">
                <span class="label-text">{{ t('customer.edit.form.label.salutation') }}</span>
            </label>

            <div class="flex flex-wrap gap-6">
                <select id="salutation" v-model="personalFormData.salutationId" required class="select select-bordered w-full">
                    <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">
                        {{ salutation.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="col-span-12 grid grid-cols-12 gap-3 lg:gap-6">
            <div class="form-control col-span-12 lg:col-span-6">
                <label for="firstName" class="label">
                    <span class="label-text">{{ t('customer.edit.form.label.firstname') }}</span>
                </label>
                <input
                    id="firstName"
                    v-model="personalFormData.firstName"
                    required
                    type="text"
                    :placeholder="t('customer.edit.form.placeholder.firstname')"
                    class="input input-bordered w-full"
                >
            </div>

            <div class="form-control col-span-12 lg:col-span-6">
                <label for="lastName" class="label">
                    <span class="label-text">{{ t('customer.edit.form.label.lastname') }}</span>
                </label>
                <input
                    id="lastName"
                    v-model="personalFormData.lastName"
                    required
                    type="text"
                    :placeholder="t('customer.address.form.placeholder.lastname')"
                    class="input input-bordered w-full"
                >
            </div>
        </div>

        <div class="form-control col-span-12">
            <label for="register-dob" class="label">
                <span class="label-text">{{ t('customer.edit.form.dob.label') }}</span>
            </label>
            <div class="input-group">
                <input
                    id="register-dob"
                    ref="dobInput"
                    v-model="personalFormData.dateOfBirth"
                    type="date"
                    class="input input-bordered w-full border-r-0"
                >
                <div class="btn btn-square" @click="dobInput.showPicker()">
                    <CalendarIcon class="w-5 h-5" />
                </div>
            </div>
        </div>

        <div class="col-span-12 py-3">
            <button type="submit" class="btn btn-outline" :disabled="loadingPersonalForm">
                <span v-if="loadingPersonalForm" class="loading" />
                {{ t('customer.edit.form.submit') }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { onMounted, ref, reactive } from 'vue'
import { CalendarIcon } from '@heroicons/vue/24/outline'
import { hblUseForm } from '@/utils/helper'
import { usePlatform, useCustomer, useNotification } from '#imports'

const { t } = useI18n()

const platformStore = usePlatform()
const { salutations, loading } = storeToRefs(platformStore)
const { getSalutations } = platformStore
onMounted(async () => {
    if (salutations.value == null) {
        const salutationResponse = await getSalutations()

        if (typeof salutationResponse !== 'undefined') {
            salutations.value = salutationResponse
        }
    }
})

const dobInput = ref()
const customerStore = useCustomer()
const { customer } = storeToRefs(customerStore)

let customerDoB: Date | null = null
if (customer?.value?.dateOfBirth != null) {
    customerDoB = new Date(customer?.value?.dateOfBirth)
}

const personalFormData: {
    salutationId: string,
    firstName: string,
    lastName: string,
    dateOfBirth: null | string
} = reactive({
    salutationId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: null
})

function fillPersonalForm () {
    personalFormData.salutationId = customer?.value?.salutationId != null ? customer?.value?.salutationId : ''
    personalFormData.firstName = customer?.value?.firstName != null ? customer?.value?.firstName : ''
    personalFormData.lastName = customer?.value?.lastName != null ? customer?.value?.lastName : ''

    if (customerDoB != null) {
        personalFormData.dateOfBirth = `${customerDoB.getFullYear()}-${customerDoB.getMonth() <= 9 ? '0' : ''}${customerDoB.getMonth() + 1}-${customerDoB.getDate() <= 9 ? '0' : ''}${customerDoB.getDate()}`
    }
}
fillPersonalForm()

const personalForm = ref()
const { editCustomerInfo } = customerStore
const loadingPersonalForm = ref(false)
const { validateForm } = hblUseForm()
const { showNotification } = useNotification()
async function onSubmitPersonalForm () {
    loadingPersonalForm.value = true

    const isValid = await validateForm(personalForm.value)
    if (!isValid) {
        loadingPersonalForm.value = false
        return
    }

    try {
        await editCustomerInfo(personalFormData)
        loadingPersonalForm.value = false
        showNotification(t('customer.edit.form.success'), 'success')
    } catch (e) {
        loadingPersonalForm.value = false
    }
}
</script>

<style lang="scss">
#register-dob[type="date"]::-webkit-inner-spin-button,
#register-dob[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}
</style>

<i18n>
{
    "en": {
        "customer.edit.form.label.salutation": "Salutation",
        "customer.edit.form.label.firstname": "First name",
        "customer.edit.form.placeholder.firstname": "Enter first name...",
        "customer.edit.form.label.lastname": "Last name",
        "customer.address.form.placeholder.lastname": "Enter last name...",
        "customer.edit.form.dob.label": "Date of birth (optional)",
        "customer.edit.form.dobInfo": "If you would like a present for your birthday",
        "customer.edit.form.submit": "Save settings",
        "customer.edit.form.success": "Settings saved successfully."
    },
    "de": {
        "customer.edit.form.label.salutation": "Anrede",
        "customer.edit.form.label.firstname": "Vorname",
        "customer.edit.form.placeholder.firstname": "Vornamen eingeben...",
        "customer.edit.form.label.lastname": "Nachname",
        "customer.address.form.placeholder.lastname": "Nachnamen eingeben...",
        "customer.edit.form.dob.label": "Geburtsdatum (optional)",
        "customer.edit.form.dobInfo": "Falls sie sich über eine kleine Aufmerksamkeit zum Geburtstag freuen würden",
        "customer.edit.form.submit": "Einstellungen speichern",
        "customer.edit.form.success": "Einstellungen erfolgreich gespeichert."
    }
}
</i18n>
