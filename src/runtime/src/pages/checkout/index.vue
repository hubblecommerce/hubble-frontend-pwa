<template>
    <div class="checkout-page flex flex-col gap-4">
        <div class="w-full text-sm breadcrumbs">
            <ul>
                <li>
                    <NuxtLink to="/cart">
                        Cart
                    </NuxtLink>
                </li>
                <li
                    class="link link-hover"
                    :class="{ 'link-accent': step === 'contact'}"
                    @click="selectStep('contact')"
                >
                    Contact
                </li>
                <li
                    class="link link-hover"
                    :class="{ 'link-accent': step === 'shipping'}"
                    @click="selectStep('shipping')"
                >
                    Shipping
                </li>
                <li
                    class="link link-hover"
                    :class="{ 'link-accent': step === 'payment'}"
                    @click="selectStep('payment')"
                >
                    Payment
                </li>
                <li
                    class="link link-hover"
                    :class="{ 'link-accent': step === 'summary'}"
                    @click="selectStep('summary')"
                >
                    Summary
                </li>
            </ul>
        </div>

        <div v-if="step !== 'contact'">
            <div>Contact:</div>
            <div>Ship to:</div>
            <div v-if="step === 'payment' || step === 'summary'">
                Shipping
            </div>
            <div v-if="step === 'summary'">
                Payment
            </div>
        </div>

        <template v-if="step === 'contact'">
            <client-only>
                <template v-if="customer">
                    <template v-if="session.isGuest">
                        <form ref="updateShippingAddressForm" class="flex flex-col gap-4" @submit.prevent="onUpdateShippingAddress()">
                            <div class="flex flex-wrap justify-between items-center">
                                <div class="text-xl pr-2">
                                    Contact Information
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <div class="form-control w-full">
                                    <label for="customer-email" class="label">
                                        <span class="label-text">E-Mail</span>
                                    </label>
                                    <input
                                        id="customer-email"
                                        v-model="customer.email"
                                        class="input input-bordered w-full"
                                        disabled
                                    >
                                </div>
                            </div>
                            <div class="flex flex-wrap justify-between items-center">
                                <div class="text-xl pr-2">
                                    Shipping Address
                                </div>
                            </div>
                            <CustomerAddressForm v-model="customer.shippingAddress" />
                            <div class="navigation flex justify-between items-center">
                                <div class="link link-hover link-accent">
                                    Back to Cart
                                </div>
                                <button
                                    class="btn btn-primary"
                                    :class="{ 'loading': customerLoading }"
                                    @click.prevent="onUpdateShippingAddress()"
                                >
                                    <span v-if="!customerLoading">Continue to Shipping</span>
                                    <span v-if="customerLoading">Loading</span>
                                </button>
                            </div>
                        </form>
                    </template>

                    <template v-else>
                        Logged in customer
                        Addressbook
                    </template>
                </template>

                <template v-else>
                    <Transition name="fade" appear>
                        <CustomerRegisterForm>
                            <template #actions="actionProps">
                                <div class="navigation flex justify-between items-center">
                                    <div v-if="step === 'contact'" class="link link-hover link-accent">
                                        Back to Cart
                                    </div>
                                    <button
                                        v-if="step === 'contact'"
                                        class="btn btn-primary"
                                        :class="{ 'loading': actionProps.loading }"
                                        @click.prevent="onUpdateShippingAddress()"
                                    >
                                        <span v-if="!actionProps.loading">Continue to Shipping</span>
                                        <span v-if="actionProps.loading">Loading</span>
                                    </button>
                                </div>
                            </template>
                        </CustomerRegisterForm>
                    </Transition>
                </template>

                <template #placeholder>
                    <div class="flex flex-col gap-4">
                        <MiscSkeleton size="large" />
                        <MiscSkeleton size="medium" />
                        <MiscSkeleton size="medium" />
                        <MiscSkeleton size="large" />
                        <MiscSkeleton size="medium" :repeat="8" />
                    </div>
                </template>
            </client-only>
        </template>

        <div v-if="step === 'shipping'">
            Shipping
        </div>

        <div v-if="step === 'payment'">
            Payment
        </div>

        <div v-if="step === 'summary'">
            Totals
        </div>

        <div class="navigation flex justify-between items-center">
            <div v-if="step === 'shipping'" class="link link-hover link-accent" @click="selectStep('contact')">
                Back to Contact
            </div>
            <div v-if="step === 'shipping'" class="btn btn-primary" @click="selectStep('payment')">
                Continue to Payment
            </div>

            <div v-if="step === 'payment'" class="link link-hover link-accent" @click="selectStep('shipping')">
                Back to Shipping
            </div>
            <div v-if="step === 'payment'" class="btn btn-primary" @click="selectStep('summary')">
                Continue to Summary
            </div>

            <div v-if="step === 'summary'" class="link link-hover link-accent" @click="selectStep('payment')">
                Back to Payment
            </div>
            <div v-if="step === 'summary'" class="btn btn-primary">
                Place Order
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { definePageMeta, useCustomer, usePlatform } from '#imports'

definePageMeta({
    layout: 'checkout',
    middleware: 'validate-cart'
})

const step = ref('contact')
const { customer, loading: customerLoading, updateShippingAddress } = useCustomer()
const { session } = usePlatform()
const protectedSteps = [
    'shipping',
    'payment',
    'summary'
]

function selectStep (stepName: string): void {
    if (protectedSteps.includes(stepName) && !customer.value) {
        return
    }

    step.value = stepName
}

function afterContactSubmit () {
    selectStep('shipping')
}

const updateShippingAddressForm = ref()
async function onUpdateShippingAddress () {
    const isValid = await updateShippingAddressForm.value.checkValidity()

    if (!isValid) {
        updateShippingAddressForm.value.reportValidity()
        return
    }

    await updateShippingAddress(customer.value.shippingAddress)
    afterContactSubmit()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
