<template>
    <template v-if="customer != null">
        <label tabindex="0" class="btn btn-ghost btn-circle">
            <span class="relative">
                <UserIcon class="h-5 w-5" />

                <client-only>
                    <span class="absolute text-success -right-1 -bottom-1 bg-success rounded-full">
                        <CheckIcon class="h-3 w-3 text-success-content" />
                    </span>
                </client-only>
            </span>
        </label>

        <CustomerGuestNavigation v-if="customer.isGuest" />
        <CustomerNavigation v-else />
    </template>
    <MiscLink
        v-else
        to="/customer"
        tabindex="0"
        class="btn btn-ghost btn-circle h-auto relative"
    >
        <UserIcon class="h-5 w-5" />
    </MiscLink>
</template>

<script setup lang="ts">
import { UserIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { useCustomer } from '#imports'

const customerStore = useCustomer()
const { customer } = storeToRefs(customerStore)
</script>
