<template>
    <div class="container lg:max-w-4xl p-6 lg:p-0 lg:my-16 m-auto">
        <div class="flex flex-col p-6 border border-base-300 rounded bg-base-100">
            <h1 class="text-2xl pb-4 border-b border-base-300">
                {{ t('customer.register.title') }}
            </h1>
            <div class="py-6">
                {{ t('customer.register.alreadyCustomer') }}
                <MiscLink no-prefetch class="link inline-block lg:ml-4" to="/customer/login">
                    {{ t('customer.register.loginLink') }}
                </MiscLink>
            </div>
            <CustomerRegisterForm :guest-form="false">
                <template #actions="actionProps">
                    <div class="navigation flex justify-between items-center">
                        <button
                            class="btn btn-primary btn-block"
                            :class="{ 'loading': actionProps.loading }"
                            @click.prevent="actionProps.submit(afterRegisterSubmit)"
                        >
                            <span v-if="!actionProps.loading">{{ t('customer.register.registerButton') }}</span>
                            <span v-if="actionProps.loading">{{ t('customer.register.loadingState') }}</span>
                        </button>
                    </div>
                </template>
            </CustomerRegisterForm>
        </div>
    </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app'
import { useI18n } from 'vue-i18n'
import { usePlatform } from '#imports'

const { t } = useI18n()

const { getSession } = usePlatform()
async function afterRegisterSubmit () {
    await getSession()
    await navigateTo('/customer')
}
</script>

<i18n>
{
    "en": {
        "customer.register.title": "Create a new account",
        "customer.register.alreadyCustomer": "Already a customer?",
        "customer.register.loginLink": "Login here!",
        "customer.register.registerButton": "Register",
        "customer.register.loadingState": "Loading..."
    },
    "de": {
        "customer.register.title": "Neues Benutzerkonto anlegen",
        "customer.register.alreadyCustomer": "Sie sind bereits Kunde?",
        "customer.register.loginLink": "Hier anmelden!",
        "customer.register.registerButton": "Benutzerkonto anlegen",
        "customer.register.loadingState": "Laden..."
    }
}
</i18n>
