<template>
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-2 lg:gap-3">
        <div class="w-full form-control">
            <label for="currentPassword" class="label">
                <span class="label-text">{{ t('customer.edit.form.password.label') }}</span>
            </label>
            <div class="input-group">
                <input
                    id="currentPassword"
                    disabled
                    value="****************"
                    type="password"
                    class="input input-bordered w-full border-r-0"
                >
                <div class="btn btn-square cursor-not-allowed">
                    <LockClosedIcon class="w-5 h-5" />
                </div>
            </div>
        </div>
        <label for="editPasswordModal" class="link lg:w-48 lg:py-3">
            {{ t('customer.edit.form.editPasswordAction') }}
        </label>
    </div>

    <input id="editPasswordModal" v-model="showPasswordEditModal" type="checkbox" class="modal-toggle">
    <label for="editPasswordModal" class="modal cursor-pointer">
        <label class="modal-box relative w-11/12 max-w-4xl pt-4 px-6 pb-8" for="">
            <div class="flex justify-between items-center pt-3 pb-5 border-b border-base-300 mb-6">
                <h4>{{ t('customer.edit.password.modalTitle') }}</h4>
                <label for="editPasswordModal" class="btn btn-ghost text-error">
                    <XCircleIcon class="w-5 h-5 lg:mr-2" />
                    <span class="hidden lg:inline">{{ t('customer.edit.password.modalClose') }}</span>
                </label>
            </div>

            <form class="flex flex-col items-start gap-3" @submit.prevent="onSubmit()">
                <div class="form-control w-full">
                    <label for="editPassword" class="label">
                        <span class="label-text">{{ t('customer.edit.form.password.label') }}</span>
                    </label>
                    <div class="input-group">
                        <input
                            id="editPassword"
                            v-model="formData.newPassword"
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

                <div class="form-control w-full">
                    <label for="editPasswordConfirmation" class="label">
                        <span class="label-text">{{ t('customer.edit.form.passwordConfirmation.label') }}</span>
                    </label>
                    <div class="input-group">
                        <input
                            id="editPasswordConfirmation"
                            v-model="formData.newPasswordConfirm"
                            required
                            :type="showPassword ? 'text' : 'password'"
                            :placeholder="t('customer.edit.form.passwordConfirmation.placeholder')"
                            class="input input-bordered w-full border-r-0"
                        >
                        <div class="btn btn-square" @click.prevent="showPassword = !showPassword">
                            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                            <EyeSlashIcon v-else class="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div class="form-control w-full">
                    <label for="oldPassword" class="label">
                        <span class="label-text">{{ t('customer.edit.form.oldPassword.label') }}</span>
                    </label>
                    <div class="input-group">
                        <input
                            id="oldPassword"
                            v-model="formData.password"
                            required
                            :type="showPassword ? 'text' : 'password'"
                            :placeholder="t('customer.edit.form.oldPassword.placeholder')"
                            class="input input-bordered w-full border-r-0"
                        >
                        <div class="btn btn-square" @click.prevent="showPassword = !showPassword">
                            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                            <EyeSlashIcon v-else class="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <button type="submit" :disabled="loading" :class="{ 'loading': loading }" class="btn btn-secondary mt-9">{{ t('customer.edit.password.modalSubmit') }}</button>
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
const { editCustomerPassword } = customerStore
const showPassword = ref(false)
const formData = reactive({
    password: '',
    newPassword: '',
    newPasswordConfirm: ''
})
const { showNotification } = useNotification()
const showPasswordEditModal = ref(false)

async function onSubmit () {
    try {
        await editCustomerPassword(formData)
        showPasswordEditModal.value = false
        formData.password = ''
        formData.newPassword = ''
        formData.newPasswordConfirm = ''
        showNotification(t('customer.edit.password.form.success'), 'success')
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
            showNotification(t('customer.edit.password.form.error'), 'error', true)
        }
    }
}
</script>

<i18n>
{
    "en": {
        "customer.edit.form.password.label": "Password",
        "customer.edit.form.editPasswordAction": "Edit password",
        "customer.edit.password.modalTitle": "Edit password",
        "customer.edit.password.modalClose": "Cancel",
        "customer.edit.password.modalSubmit": "Save password",
        "customer.edit.form.password.placeholder": "Enter new password...",
        "customer.edit.form.passwordConfirmation.label": "Password confirmation",
        "customer.edit.form.passwordConfirmation.placeholder": "Enter new password confirmation...",
        "customer.edit.form.oldPassword.label": "Old password",
        "customer.edit.form.oldPassword.placeholder": "Enter old password...",
        "customer.edit.password.form.success": "Password saved successfully.",
        "customer.edit.password.form.error": "An error occured: make sure your inputs and password is correct."
    },
    "de": {
        "customer.edit.form.password.label": "Passwort",
        "customer.edit.form.editPasswordAction": "Passwort bearbeiten",
        "customer.edit.password.modalTitle": "Passwort bearbeiten",
        "customer.edit.password.modalClose": "Abbrechen",
        "customer.edit.password.modalSubmit": "Passwort speichern",
        "customer.edit.form.password.placeholder": "Neues Passwort eingeben...",
        "customer.edit.form.passwordConfirmation.label": "Neues Passwort bestätigen",
        "customer.edit.form.passwordConfirmation.placeholder": "Neues Passwort bestätigen...",
        "customer.edit.form.oldPassword.label": "Altes Passwort",
        "customer.edit.form.oldPassword.placeholder": "Altes Passwort eingeben...",
        "customer.edit.password.form.success": "Passwort gespeichert.",
        "customer.edit.password.form.error": "Ein Fehler ist aufgetreten: Stellen Sie sicher, dass Ihre Eingaben und Ihr Passwort korrekt sind."
    }
}
</i18n>
