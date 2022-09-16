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
import { useCustomer, useNotification } from '#imports'
import { useForm } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    hash: string
}>()

const { validateForm } = useForm()
const { setNewPassword, loading, error } = useCustomer()
const { showNotification } = useNotification()

const passwordResetForm = ref()
const password = ref()
const passwordRepeat = ref()

async function onResetPasswordClick () {
    const isValid = await validateForm(passwordResetForm.value)

    if (!isValid) {
        return
    }

    try {
        await setNewPassword(props.hash, password.value, passwordRepeat.value)

        password.value = ''
        passwordRepeat.value = ''

        showNotification('New Password set', 'success')

        await navigateTo('/customer/login')
    } catch (e) {}
}
</script>
