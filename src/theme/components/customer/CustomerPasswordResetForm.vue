<template>
    <form ref="passwordResetForm" class="form-control flex space-y-4">
        <label for="password" class="input-group input-group-vertical input-group-sm">
            <span>Password</span>
            <input
                id="password"
                v-model="password"
                required
                name="password"
                type="password"
                placeholder="Your new password"
                class="input input-bordered input-sm"
            >
        </label>

        <label for="passwordRepeat" class="input-group input-group-vertical input-group-sm">
            <span>Repeat Password</span>
            <input
                id="passwordRepeat"
                v-model="passwordRepeat"
                required
                name="password"
                type="password"
                placeholder="Repeat your ne password"
                class="input input-bordered input-sm"
            >
        </label>

        <div v-if="error" class="alert alert-error" v-text="error?.body[0]?.detail" />

        <button
            type="submit"
            class="btn btn-primary btn-sm"
            @click.prevent="onResetPasswordClick()"
            v-text="loading ? 'Loading...' : 'Reset Password'"
        />
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { navigateTo } from '#app'
import { storeToRefs } from 'pinia'
import { useCustomer, useNotification } from '#imports'
import { useForm } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    hash: string
}>()

const { validateForm } = useForm()
const customerStore = useCustomer()
const { error } = storeToRefs(customerStore)
const { setNewPassword } = customerStore
const { showNotification } = useNotification()
const loading = ref(false)

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

        await navigateTo('/customer/login')
    } catch (e) {
        loading.value = false
    }
}
</script>
