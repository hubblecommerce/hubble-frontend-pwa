<template>
    <ul tabindex="0" class="menu menu-compact dropdown-content p-2 shadow bg-base-100 rounded-box">
        <li>
            <MiscLink no-prefetch to="/customer" class="justify-between">
                {{ t('customer.navigation.orders') }}
            </MiscLink>
        </li>
        <li>
            <MiscLink no-prefetch to="/customer/account" class="justify-between">
                {{ t('customer.navigation.account') }}
            </MiscLink>
        </li>
        <li>
            <MiscLink no-prefetch to="/customer/addresses" class="justify-between">
                {{ t('customer.navigation.addresses') }}
            </MiscLink>
        </li>
        <li>
            <MiscLink no-prefetch to="/customer/payments" class="justify-between">
                {{ t('customer.navigation.payments') }}
            </MiscLink>
        </li>
        <li>
            <div @click="logout()">
                <ArrowLeftOnRectangleIcon class="w-6 h-6 mr-2 fill-link" />
                <span class="text-link">{{ t('customer.navigation.logout') }}</span>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useCustomer, useRoute } from '#imports'

defineProps({
    horizontal: Boolean
})

const { t } = useI18n()
const { logout } = useCustomer()
const route = useRoute()
const emit = defineEmits(['clickActiveLink'])

function onClick (target) {
    if (route.path === target) {
        emit('clickActiveLink')
    }
}
</script>

<i18n>
{
    "en": {
        "customer.navigation.orders": "Orders",
        "customer.navigation.account": "Account",
        "customer.navigation.addresses": "Addresses",
        "customer.navigation.payments": "Payments",
        "customer.navigation.logout": "Logout"
    },
    "de": {
        "customer.navigation.orders": "Bestellungen",
        "customer.navigation.account": "Persönliche Daten",
        "customer.navigation.addresses": "Adressdaten",
        "customer.navigation.payments": "Zahlungsarten",
        "customer.navigation.logout": "Abmelden"
    }
}
</i18n>
