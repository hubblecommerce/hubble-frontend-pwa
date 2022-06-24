<template>
    <div>
        <div>
            <label for="username">Username</label>
            <input id="username" v-model="username" name="username" type="text">
        </div>
        <div>
            <label for="password">Password</label>
            <input id="password" v-model="password" name="password" type="password">
        </div>
        <div>
            <button
                :disabled="loading"
                type="submit"
                @click.prevent="onLoginClick()"
                v-text="loading ? 'Loading...' : 'Login'"
            />
        </div>
        <div v-if="customerError" v-text="customerError" />
    </div>
</template>

<script setup>
import { useCustomer } from '#imports'

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
