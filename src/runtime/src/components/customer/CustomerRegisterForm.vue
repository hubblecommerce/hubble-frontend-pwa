<template>
    <form ref="registerForm" class="customer-register-form flex flex-col gap-4" @submit.prevent="onSubmit">
        <div class="flex flex-wrap justify-between items-center">
            <div class="text-xl pr-2">
                Contact Information
            </div>
            <div class="text-sm">
                Already a customer?
                <NuxtLink class="link link-accent link-hover" to="/customer/login">
                    Login here!
                </NuxtLink>
            </div>
        </div>

        <div class="flex flex-wrap gap-2">
            <div class="form-control w-full">
                <label for="register-email" class="label">
                    <span class="label-text">E-Mail</span>
                </label>
                <input
                    id="register-email"
                    v-model="form.email"
                    required
                    type="email"
                    placeholder="E-Mail"
                    class="input input-bordered w-full"
                >
            </div>

            <div class="form-control">
                <label class="label cursor-pointer">
                    <input v-model="form.createAccount" type="checkbox" checked="checked" class="checkbox mr-2">
                    <span class="label-text">Create a customer account</span>
                </label>
            </div>

            <div v-if="form.createAccount" class="form-control w-full">
                <label for="register-password" class="label">
                    <span class="label-text">Password</span>
                </label>
                <input
                    id="register-password"
                    v-model="form.password"
                    required
                    type="password"
                    placeholder="Password"
                    class="input input-bordered w-full"
                >
            </div>
        </div>

        <div class="flex flex-wrap justify-between items-center">
            <div class="text-xl pr-2">
                Shipping Address
            </div>
        </div>

        <CustomerAddressForm v-model="shippingAddress" />

        <slot name="actions" :submit="onSubmit" :loading="loading" />
    </form>
</template>

<script setup lang="ts">
import { ref, Ref, computed, ComputedRef } from 'vue'
import { useCustomer } from '#imports'
import { CustomerBillingAddress, CustomerShippingAddress, RegisterCustomerForm } from '@hubblecommerce/hubble/commons'

const registerForm = ref()

const shippingAddress: Ref<CustomerShippingAddress> = ref({
    id: '',
    salutation: '',
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    zipcode: '',
    city: '',
    country: ''
})

const billingAddress: Ref<CustomerBillingAddress> = ref({
    id: '',
    salutation: '',
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    zipcode: '',
    city: '',
    country: ''
})

const form: ComputedRef<RegisterCustomerForm> = computed(() => {
    return {
        email: '',
        createAccount: false,
        billingSameAsShipping: true,
        shippingAddress,
        billingAddress
    }
})

const emit = defineEmits(['form-submitted'])
const { register, loading, error } = useCustomer()

async function onSubmit (callback?): Promise<string> {
    const isValid = await registerForm.value.checkValidity()

    if (!isValid) {
        registerForm.value.reportValidity()
        return
    }

    await register(form.value)

    emit('form-submitted')
    return callback()
}
</script>
