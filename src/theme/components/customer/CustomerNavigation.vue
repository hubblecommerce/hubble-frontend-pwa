<template>
    <ul tabindex="0" class="menu menu-compact dropdown-content p-2 shadow bg-base-100 rounded-box">
        <li>
            <MiscLink no-prefetch to="/customer" class="justify-between">
                Profile
                <span class="badge">New</span>
            </MiscLink>
        </li>
        <li>
            <a href="#" @click="logout()">
                Logout
            </a>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { useCustomer } from '#imports'

const { logout } = useCustomer()
</script>
