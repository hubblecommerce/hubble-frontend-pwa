<template>
    <div class="container lg:max-w-xl m-auto p-6 my-6 flex flex-col">
        <div class="flex flex-col gap-4 p-8 shadow-xl">
            <div class="text-2xl text-center">
                Reset Password
            </div>
            <CustomerPasswordResetForm v-if="hash" :hash="hash" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from '#app'
import { useLocalisation } from '#imports'
const { currentRoute } = useRouter()
const hash = currentRoute.value.query?.hash
const { navigateToI18n } = useLocalisation()

if (hash == null || hash === '') {
    await navigateToI18n('/customer/login')
}
</script>
