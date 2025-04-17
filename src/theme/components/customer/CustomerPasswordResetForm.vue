<template>
    <form ref="passwordResetForm" class="flex space-y-4">
        <fieldset class="fieldset">
            <label for="password">
                <span>Password</span>
                <input
                    id="password"
                    v-model="password"
                    required
                    name="password"
                    type="password"
                    placeholder="Your new password"
                    class="input input-sm"
                >
            </label>

            <label for="passwordRepeat">
                <span>Repeat Password</span>
                <input
                    id="passwordRepeat"
                    v-model="passwordRepeat"
                    required
                    name="password"
                    type="password"
                    placeholder="Repeat your ne password"
                    class="input input-sm"
                >
            </label>

            <div v-if="error" class="alert alert-error" v-text="error?.body[0]?.detail" />

            <button
                type="submit"
                class="btn btn-primary btn-sm"
                :disabled="loading"
                @click.prevent="onResetPasswordClick()"
            >
                <span v-if="loading" class="loading" />
                <span v-text="loading ? 'Loading...' : 'Reset Password'" />
            </button>
        </fieldset>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCustomer, useNotification, useLocalisation } from '#imports'
import { hblUseForm } from '@/utils/helper'

const props = defineProps<{
    hash: string
}>()

const { validateForm } = hblUseForm()
const customerStore = useCustomer()
const { error } = storeToRefs(customerStore)
const { setNewPassword } = customerStore
const { showNotification } = useNotification()
const loading = ref(false)
const { navigateToI18n } = useLocalisation()

const passwordResetForm = ref()
const password = ref()
const passwordRepeat = ref()

async function onResetPasswordClick () {
    loading.value = true
    const isValid = await validateForm(passwordResetForm.value)

    if (!isValid) {
        loading.value = false
        return
    }

    try {
        await setNewPassword(props.hash, password.value, passwordRepeat.value)

        password.value = ''
        passwordRepeat.value = ''

        showNotification('New Password set', 'success')

        await navigateToI18n('/customer/login')
    } catch (e) {
        loading.value = false
    }
}
</script>
