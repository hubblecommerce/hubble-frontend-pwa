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

        <div v-if="step === 'contact'">
            <client-only>
                <div v-if="customer && !customer.isGuest">
                    Logged In: Address book
                </div>
                <div v-else>
                    Guest: Express Checkout Login Register
                </div>
            </client-only>
        </div>

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
            <div v-if="step === 'contact'" class="link link-hover link-accent">
                Back to Cart
            </div>
            <div v-if="step === 'contact'" class="btn btn-primary" @click="selectStep('shipping')">
                Continue to Shipping
            </div>

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
import { definePageMeta, useCustomer } from '#imports'

definePageMeta({
    layout: 'checkout',
    middleware: 'validate-cart'
})

const step = ref('contact')
const { customer } = useCustomer()
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
</script>
