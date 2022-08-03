<template>
    <div class="form-control flex space-y-4">
        <label for="email" class="input-group input-group-vertical input-group-sm">
            <span>E-Mail</span>
            <input
                id="username"
                v-model="username"
                name="username"
                type="text"
                placeholder="Your E-Mail"
                class="input input-bordered input-sm"
            >
        </label>

        <label for="password" class="input-group input-group-vertical input-group-sm">
            <span>Password</span>
            <input id="password" v-model="password" name="password" type="password" class="input input-bordered input-sm">
        </label>

        <div v-if="customerError" class="alert alert-error" v-text="customerError" />

        <div
            class="btn btn-primary btn-sm"
            @click.prevent="onLoginClick()"
            v-text="loading ? 'Loading...' : 'Login'"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCustomer } from '#imports'
import { navigateTo } from '#app'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const username = ref()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const password = ref()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { login, error: customerError, loading } = useCustomer()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onLoginClick () {
    try {
        await login(username.value, password.value)

        username.value = ''
        password.value = ''

        navigateTo('/customer')
    } catch (e) {

    }
}
</script>

<style scoped>

</style>
