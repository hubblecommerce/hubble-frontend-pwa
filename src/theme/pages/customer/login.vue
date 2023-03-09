<template>
    <div class="container m-auto p-6 lg:my-12 flex flex-col items-start gap-6 lg:flex-row 2xl:max-w-6xl">
        <div class="w-full flex flex-col gap-6 p-6 border border-base-300 rounded bg-base-100">
            <h2 class="text-2xl pb-4 border-b border-base-300">
                {{ t('customer.login.loginTitle') }}
            </h2>
            <CustomerLoginForm class="-mt-2" />
        </div>
        <div class="w-full flex flex-col items-start gap-6 p-6 border border-base-300 rounded bg-base-100">
            <h2 class="text-2xl w-full pb-4 border-b border-base-300">
                {{ t('customer.login.registerTitle') }}
            </h2>
            <p>{{ t('customer.login.registerInfo') }}</p>
            <MiscLink to="/customer/register" class="w-full lg:w-auto btn btn-outline">
                {{ t('customer.login.registerButton') }}
            </MiscLink>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<i18n>
{
    "en": {
        "customer.login.loginTitle": "Login to your account",
        "customer.login.registerTitle": "Don't have an account?",
        "customer.login.registerInfo": "When you register, we create a user account for you. This gives you an overview of your orders, you can track the order status and you are a lot faster for future orders.",
        "customer.login.registerButton": "Create a new account"
    },
    "de": {
        "customer.login.loginTitle": "Anmelden",
        "customer.login.registerTitle": "Noch kein Konto?",
        "customer.login.registerInfo": "Mit der Registrierung legen wir dir ein Benutzerkonto an. Damit hast du eine Übersicht über deine Bestellungen, kannst den Bestellstatus verfolgen und für künftige Bestellungen bist du einiges schneller.",
        "customer.login.registerButton": "Neues Konto erstellen"
    }
}
</i18n>
