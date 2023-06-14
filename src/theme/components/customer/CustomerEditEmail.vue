<template>
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-2 lg:gap-3">
        <div class="w-full form-control">
            <label for="currentEmail" class="label">
                <span class="label-text">{{ t('customer.edit.form.email.label') }}</span>
            </label>
            <div class="input-group">
                <input
                    id="currentEmail"
                    v-model="customer.email"
                    disabled
                    type="text"
                    class="input input-bordered w-full border-r-0"
                >
                <div class="btn btn-square cursor-not-allowed">
                    <LockClosedIcon class="w-5 h-5" />
                </div>
            </div>
        </div>
        <label for="editEmailModal" class="link lg:w-48 lg:py-3">
            {{ t('customer.edit.form.editEmailAction') }}
        </label>
    </div>

    <input id="editEmailModal" v-model="showEmailEditModal" type="checkbox" class="modal-toggle">
    <label for="editEmailModal" class="modal cursor-pointer">
        <label class="modal-box relative w-11/12 max-w-4xl pt-4 px-6 pb-8" for="">
            <div class="flex justify-between items-center pt-3 pb-5 border-b border-base-300 mb-6">
                <h4>{{ t('customer.edit.email.modalTitle') }}</h4>
                <label for="editEmailModal" class="btn btn-ghost text-error">
                    <XCircleIcon class="w-5 h-5 lg:mr-2" />
                    <span class="hidden lg:inline">{{ t('customer.edit.email.modalClose') }}</span>
                </label>
            </div>

            <form class="flex flex-col items-start gap-3" @submit.prevent="onSubmit()">
                <div class="form-control w-full">
                    <label for="editEmail" class="label">
                        <span class="label-text">{{ t('customer.edit.form.email.label') }}</span>
                    </label>
                    <input
                        id="editEmail"
                        v-model="formData.email"
                        required
                        type="email"
                        inputmode="email"
                        :placeholder="t('customer.edit.form.email.placeholder')"
                        class="input input-bordered w-full"
                    >
                </div>

                <div class="form-control w-full">
                    <label for="editEmailConfirmation" class="label">
                        <span class="label-text">{{ t('customer.edit.form.emailConfirmation.label') }}</span>
                    </label>
                    <input
                        id="editEmailConfirmation"
                        v-model="formData.emailConfirmation"
                        required
                        type="email"
                        inputmode="email"
                        :placeholder="t('customer.edit.form.emailConfirmation.placeholder')"
                        class="input input-bordered w-full"
                    >
                </div>

                <div class="form-control w-full">
                    <label for="register-password" class="label">
                        <span class="label-text">{{ t('customer.edit.form.password.label') }}</span>
                    </label>
                    <div class="input-group">
                        <input
                            id="register-password"
                            v-model="formData.password"
                            required
                            :type="showPassword ? 'text' : 'password'"
                            :placeholder="t('customer.edit.form.password.placeholder')"
                            class="input input-bordered w-full border-r-0"
                        >
                        <div class="btn btn-square" tabindex="0" @click.prevent="showPassword = !showPassword" @keypress.space.prevent="showPassword = !showPassword">
                            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                            <EyeSlashIcon v-else class="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <button type="submit" :disabled="loading" :class="{ 'loading': loading }" class="btn btn-secondary mt-9">{{ t('customer.edit.email.modalSubmit') }}</button>
            </form>
        </label>
    </label>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { LockClosedIcon, XCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { useCustomer, useNotification } from '#imports'

const { t } = useI18n()
const customerStore = useCustomer()
const { customer, loading } = storeToRefs(customerStore)
const { editCustomerEmail } = customerStore
const showPassword = ref(false)
const formData = reactive({
    email: '',
    emailConfirmation: '',
    password: ''
})
const { showNotification } = useNotification()
const showEmailEditModal = ref(false)

async function onSubmit () {
    try {
        await editCustomerEmail(formData)
        showEmailEditModal.value = false
        formData.email = ''
        formData.emailConfirmation = ''
        formData.password = ''
        showNotification(t('customer.edit.email.form.success'), 'success')
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
            showNotification(t('customer.edit.email.form.error'), 'error', true)
        }
    }
}
</script>

<i18n>
{
    "en": {
        "customer.edit.form.email.label": "Email",
        "customer.edit.form.editEmailAction": "Edit email",
        "customer.edit.email.modalTitle": "Edit email",
        "customer.edit.email.modalClose": "Cancel",
        "customer.edit.email.modalSubmit": "Save email",
        "customer.edit.form.email.placeholder": "Enter new email address...",
        "customer.edit.form.emailConfirmation.label": "Email confirmation",
        "customer.edit.form.emailConfirmation.placeholder": "Enter new email confirmation...",
        "customer.edit.form.password.label": "Password",
        "customer.edit.form.password.placeholder": "Enter password...",
        "customer.edit.email.form.success": "Email saved successfully.",
        "customer.edit.email.form.error": "An error occured: make sure your inputs and password is correct."
    },
    "de": {
        "customer.edit.form.email.label": "E-Mail Adresse",
        "customer.edit.form.editEmailAction": "E-Mail bearbeiten",
        "customer.edit.email.modalTitle": "E-Mail bearbeiten",
        "customer.edit.email.modalClose": "Abbrechen",
        "customer.edit.email.modalSubmit": "E-Mail speichern",
        "customer.edit.form.email.placeholder": "Neue E-Mail Adresse eingeben...",
        "customer.edit.form.emailConfirmation.label": "E-Mail bestätigen",
        "customer.edit.form.emailConfirmation.placeholder": "Neue E-Mail Adresse bestätigen...",
        "customer.edit.form.password.label": "Passwort",
        "customer.edit.form.password.placeholder": "Passwort eingeben...",
        "customer.edit.email.form.success": "E-Mail Adresse gespeichert.",
        "customer.edit.email.form.error": "Ein Fehler ist aufgetreten: Stellen Sie sicher, dass Ihre Eingaben und Ihr Passwort korrekt sind."
    }
}
</i18n>
