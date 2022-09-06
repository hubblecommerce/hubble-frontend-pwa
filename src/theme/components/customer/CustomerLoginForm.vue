<template>
    <form ref="loginForm" class="form-control flex space-y-4">
        <label for="email" class="input-group input-group-vertical input-group-sm">
            <span>E-Mail</span>
            <input
                id="username"
                v-model="username"
                required
                name="username"
                type="text"
                placeholder="Your E-Mail"
                class="input input-bordered input-sm"
            >
        </label>

        <label v-if="!resetPassword" for="password" class="input-group input-group-vertical input-group-sm">
            <span>Password</span>
            <input
                id="password"
                v-model="password"
                :required="!resetPassword"
                name="password"
                type="password"
                placeholder="Your Password"
                class="input input-bordered input-sm"
            >
        </label>

        <button
            v-if="!resetPassword"
            type="submit"
            class="btn btn-primary btn-sm"
            @click.prevent="onLoginClick()"
            v-text="loading ? 'Loading...' : 'Login'"
        />

        <button
            v-if="resetPassword"
            type="submit"
            class="btn btn-primary btn-sm"
            @click.prevent="onResetPasswordClick()"
            v-text="loading ? 'Loading...' : 'Reset Password'"
        />

        <div class="link link-hover text-center text-sm" @click="resetPassword = !resetPassword">
            <span v-if="!resetPassword">I've forgotten my password</span>
            <span v-if="resetPassword">I want to login</span>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { navigateTo } from '#app'
import { useCustomer, useNotification } from '#imports'
import { useForm } from '@hubblecommerce/hubble/commons'

const { validateForm } = useForm()
const { showNotification } = useNotification()
const username = ref()
const password = ref()
const loginForm = ref()

const { login, loading, requireNewPassword } = useCustomer()
const resetPassword = ref(false)

async function onLoginClick () {
    try {
        const isValid = await validateForm(loginForm.value)

        if (!isValid) {
            return
        }

        await login(username.value, password.value)

        username.value = ''
        password.value = ''

        navigateTo('/customer')
    } catch (e) {}
}

async function onResetPasswordClick () {
    try {
        const isValid = await validateForm(loginForm.value)

        if (!isValid) {
            return
        }

        await requireNewPassword(username.value)

        showNotification('We have sent you an email. Please follow the instructions.')

        username.value = ''
        password.value = ''
    } catch (e) {}
}
</script>

<style scoped>

</style>
