<template>
    <form ref="registerForm" class="customer-register-form flex flex-col gap-4" @submit.prevent="onSubmit">
        <div class="flex flex-wrap justify-between items-center">
            <div class="text-xl pr-2">
                Contact Information
            </div>
            <div class="text-sm">
                Already a customer?
                <NuxtLink no-prefetch class="link link-accent link-hover" to="/customer/login">
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
                    v-model="email"
                    required
                    type="email"
                    placeholder="E-Mail"
                    class="input input-bordered w-full"
                >
            </div>

            <div v-if="guestForm" class="form-control">
                <label class="label cursor-pointer">
                    <input v-model="createAccount" type="checkbox" checked="checked" class="checkbox mr-2">
                    <span class="label-text">Create a customer account</span>
                </label>
            </div>

            <div v-if="createAccount" class="form-control w-full">
                <label for="register-password" class="label">
                    <span class="label-text">Password</span>
                </label>
                <input
                    id="register-password"
                    v-model="password"
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

        <CustomerAddressForm id="registerShippingAddress" v-model="shippingAddress" />

        <div class="flex flex-wrap justify-between items-center">
            <div class="text-xl pr-2">
                Billing Address
            </div>
        </div>

        <div class="flex flex-col border border-base-300">
            <div>
                <label for="same-billing-address" class="flex justify-between items-center p-4 cursor-pointer border-b border-base-300">
                    <input
                        id="same-billing-address"
                        v-model="billingSameAsShipping"
                        :value="true"
                        type="radio"
                        class="radio checked:bg-primary w-6 mr-4"
                    >
                    <div class="mr-auto">Identical to shipping address</div>
                </label>
                <label for="different-billing-address" class="flex justify-between items-center p-4 cursor-pointer">
                    <input
                        id="different-billing-address"
                        v-model="billingSameAsShipping"
                        :value="false"
                        type="radio"
                        class="radio checked:bg-primary w-6 mr-4"
                    >
                    <div class="mr-auto">Use a different billing address</div>
                </label>
                <div v-if="!billingSameAsShipping" class="p-4 bg-base-200 border-t border-base-300">
                    <CustomerAddressForm id="registerBillingAddress" v-model="billingAddress" />
                </div>
            </div>
        </div>

        <slot name="actions" :submit="onSubmit" :loading="loading" />
    </form>
</template>

<script setup lang="ts">
import { ref, Ref, withDefaults } from 'vue'
import { useCustomer } from '#imports'
import { CustomerBillingAddress, CustomerShippingAddress, useForm } from '@hubblecommerce/hubble/commons'

type CustomerRegisterFormProps = {
    guestForm?: boolean
}

const props = withDefaults(defineProps<CustomerRegisterFormProps>(), {
    guestForm: false
})

const registerForm = ref()
const email = ref('')
const password = ref('')
const createAccount = ref(!props.guestForm)
const billingSameAsShipping = ref(true)
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

const emit = defineEmits(['form-submitted'])
const { register, loading, error } = useCustomer()
const { validateForm } = useForm()

async function onSubmit (callback?): Promise<string> {
    const isValid = await validateForm(registerForm.value)
    if (!isValid) {
        return
    }

    await register({
        email: email.value,
        ...(createAccount.value && { password: password.value }),
        createAccount: createAccount.value,
        billingSameAsShipping: billingSameAsShipping.value,
        shippingAddress,
        billingAddress
    })

    emit('form-submitted')
    return callback()
}
</script>
