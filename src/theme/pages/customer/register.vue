<template>
    <div class="container lg:max-w-xl m-auto p-6 my-6">
        <div class="flex flex-col gap-4 p-8 shadow-xl">
            <div class="text-2xl text-center">
                Create a new account
            </div>
            <CustomerRegisterForm :guest-form="false">
                <template #actions="actionProps">
                    <div class="navigation flex justify-between items-center">
                        <button
                            class="btn btn-primary"
                            :class="{ 'loading': actionProps.loading }"
                            @click.prevent="actionProps.submit(afterRegisterSubmit)"
                        >
                            <span v-if="!actionProps.loading">Register</span>
                            <span v-if="actionProps.loading">Loading</span>
                        </button>
                    </div>
                </template>
            </CustomerRegisterForm>
        </div>
    </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app'
import { usePlatform } from '#imports'

const { getSession } = usePlatform()
async function afterRegisterSubmit () {
    await getSession()
    await navigateTo('/customer')
}
</script>
