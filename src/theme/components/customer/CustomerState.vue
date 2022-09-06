<template>
    <template v-if="customer != null">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
                <img src="https://placeimg.com/80/80/people" alt="Me">
            </div>
        </label>

        <CustomerGuestNavigation v-if="customer.isGuest" />
        <CustomerNavigation v-else />
    </template>
    <template v-else>
        <label tabindex="0" class="btn btn-ghost btn-circle">
            <div class="indicator">
                <UserIcon class="h-5 w-5" />
            </div>
        </label>
        <div tabindex="0" class="card card-compact dropdown-content p-2 shadow bg-base-100 rounded-box">
            <div class="card-body">
                <CustomerLoginForm />
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
import { UserIcon } from '@heroicons/vue/24/outline'
import { useCustomer } from '#imports'

const { customer } = useCustomer()
</script>
