<template>
    <form ref="loginForm">
        <div class="form-control">
            <label for="email" class="label">
                <span class="label-text">
                    {{ t('customerLogin.mailTitle') }}
                </span>
            </label>
            <input
                id="username"
                v-model="username"
                required
                name="username"
                type="email"
                inputmode="email"
                :placeholder="t('customerLogin.mailPlaceholder')"
                class="input input-bordered w-full"
            >
        </div>

        <div v-if="!resetPassword" class="form-control mt-4">
            <label for="password" class="label">
                <span class="label-text">
                    {{ t('customerLogin.passwordTitle') }}
                </span>
            </label>
            <div class="input-group">
                <input
                    id="password"
                    v-model="password"
                    :required="!resetPassword"
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    :placeholder="t('customerLogin.passwordPlaceholder')"
                    class="input input-bordered w-full border-r-0"
                >
                <div class="btn btn-square" tabindex="0" @click="showPassword = !showPassword" @keypress.space.prevent="showPassword = !showPassword">
                    <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                    <EyeSlashIcon v-else class="w-5 h-5" />
                </div>
            </div>
        </div>

        <button
            v-if="!resetPassword"
            type="submit"
            class="btn btn-primary btn-block mt-8"
            @click.prevent="onLoginClick()"
            v-text="loading ? t('customerLogin.loading') : t('customerLogin.login')"
        />

        <button
            v-if="resetPassword"
            type="submit"
            class="btn btn-primary btn-block mt-8"
            @click.prevent="onResetPasswordClick()"
            v-text="loading ? t('customerLogin.loading') : t('customerLogin.reset')"
        />

        <div class="link link-hover text-center text-sm mt-4" @click="resetPassword = !resetPassword">
            <span v-if="!resetPassword">{{ t('customerLogin.passwordReset') }}</span>
            <span v-if="resetPassword">{{ t('customerLogin.passwordLogin') }}</span>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from '#app'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { hblUseForm } from '@/utils/helper'
import { useCustomer, useNotification } from '#imports'

const { t } = useI18n()

const { validateForm } = hblUseForm()
const { showNotification } = useNotification()
const username = ref()
const password = ref()
const loginForm = ref()

const { login, requireNewPassword } = useCustomer()
const resetPassword = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const { $hblBus } = useNuxtApp()

async function onLoginClick () {
    try {
        loading.value = true
        const isValid = await validateForm(loginForm.value)

        if (!isValid) {
            loading.value = false
            return
        }

        await login(username.value, password.value)

        $hblBus.$emit('login')

        username.value = ''
        password.value = ''

        window.location.href = '/customer'
    } catch (e) {
        loading.value = false
    }
}

async function onResetPasswordClick () {
    try {
        const isValid = await validateForm(loginForm.value)

        if (!isValid) {
            return
        }

        await requireNewPassword(username.value)

        showNotification(t('customerLogin.passwordResetNote'))

        username.value = ''
        password.value = ''
    } catch (e) {
    }
}
</script>

<i18n>
{
    "en": {
        "customerLogin.loading": "Loading...",
        "customerLogin.login": "Login",
        "customerLogin.reset": "Reset password",
        "customerLogin.mailTitle": "E-mail",
        "customerLogin.mailPlaceholder": "Your e-mail",
        "customerLogin.passwordTitle": "Password",
        "customerLogin.passwordPlaceholder": "Your password",
        "customerLogin.passwordReset": "Forgot your password?",
        "customerLogin.passwordLogin": "I want to log in",
        "customerLogin.passwordResetNote": "We have sent you an email. Please follow the instructions."
    },
    "de": {
        "customerLogin.loading": "Laden...",
        "customerLogin.login": "Jetzt anmelden",
        "customerLogin.reset": "Passwort zurücksetzen",
        "customerLogin.mailTitle": "E-Mail",
        "customerLogin.mailPlaceholder": "Ihre E-Mail-Adresse",
        "customerLogin.passwordTitle": "Passwort",
        "customerLogin.passwordPlaceholder": "Ihr Passwort",
        "customerLogin.passwordReset": "Ich habe mein Passwort vergessen.",
        "customerLogin.passwordLogin": "Ich habe bereits ein Konto.",
        "customerLogin.passwordResetNote": "Wir haben Ihnen eine E-Mail gesendet. Bitte folgen Sie den Anweisungen."
    }
}
</i18n>
