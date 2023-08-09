<template>
    <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box">
        <li>
            <a href="#" @click="logout()">
                End Guest Session
            </a>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { useCustomer } from '#imports'

const { logout } = useCustomer()
</script>
