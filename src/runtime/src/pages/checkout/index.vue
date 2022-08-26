<template>
    <div class="checkout-page flex flex-col gap-4">
        <div class="w-full text-sm breadcrumbs">
            <ul>
                <li>
                    <NuxtLink to="/cart">
                        Cart
                    </NuxtLink>
                </li>
                <li class="link link-hover" :class="{ 'link-accent': step === 'contact'}" @click="selectStep('contact')">
                    Contact
                </li>
                <li class="link link-hover" :class="{ 'link-accent': step === 'shipping'}" @click="selectStep('shipping')">
                    Shipping
                </li>
                <li class="link link-hover" :class="{ 'link-accent': step === 'payment'}" @click="selectStep('payment')">
                    Payment
                </li>
                <li class="link link-hover" :class="{ 'link-accent': step === 'summary'}" @click="selectStep('summary')">
                    Summary
                </li>
            </ul>
        </div>

        <div v-if="step === 'summary'" class="text-xl pr-2">
            Summary
        </div>

        <div v-if="step !== 'contact'" :class="{ 'mb-8': step !== 'summary' }" class="flex flex-col p-2 border border-base-300 text-sm">
            <div class="grid grid-cols-12 gap-2">
                <div class="col-span-6 md:col-span-3 order-1">
                    Contact
                </div>
                <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                    {{ customer.email }}
                </div>
            </div>
            <div class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-base-300">
                <div class="col-span-6 md:col-span-3 order-1">
                    Ship to <span v-if="customer.billingSameAsShipping">/ Billing to</span>
                </div>
                <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                    <CustomerAddressRenderer :address="customer.shippingAddress" />
                </div>
                <div class="col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start">
                    Edit
                </div>
            </div>
            <div v-if="!customer.billingSameAsShipping" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-base-300">
                <div class="col-span-6 md:col-span-3 order-1">
                    Billing to
                </div>
                <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                    <CustomerAddressRenderer :address="customer.billingAddress" />
                </div>
                <div class="col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start">
                    Edit
                </div>
            </div>
            <div v-if="step === 'payment' || step === 'summary'" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-base-300">
                <div class="col-span-6 md:col-span-3 order-1">
                    Shipping
                </div>
                <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                    {{ session.shippingMethod.name }}
                </div>
                <div class="col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start">
                    Edit
                </div>
            </div>
            <div v-if="step === 'summary'" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-base-300">
                <div class="col-span-6 md:col-span-3 order-1">
                    Payment
                </div>
                <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                    {{ session.paymentMethod.name }}
                </div>
                <div class="col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start">
                    Edit
                </div>
            </div>
        </div>

        <template v-if="step === 'contact'">
            <client-only>
                <template v-if="customer">
                    <form ref="updateContactForm" class="flex flex-col gap-4" @submit.prevent="onUpdateContact()">
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
                        <CustomerAddressForm id="shipping-address" v-model="customer.shippingAddress" />

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
                                        v-model="customer.billingSameAsShipping"
                                        :value="true"
                                        type="radio"
                                        class="radio checked:bg-primary w-6 mr-4"
                                    >
                                    <div class="mr-auto">Identical to shipping address</div>
                                </label>
                                <label for="different-billing-address" class="flex justify-between items-center p-4 cursor-pointer">
                                    <input
                                        id="different-billing-address"
                                        v-model="customer.billingSameAsShipping"
                                        :value="false"
                                        type="radio"
                                        class="radio checked:bg-primary w-6 mr-4"
                                    >
                                    <div class="mr-auto">Use a different billing address</div>
                                </label>
                                <div v-if="!customer.billingSameAsShipping" class="p-4 bg-base-200 border-t border-base-300">
                                    <CustomerAddressForm id="billing-address" v-model="customer.billingAddress" />
                                </div>
                            </div>
                        </div>

                        <div class="navigation flex justify-between items-center">
                            <div class="link link-hover link-accent">
                                Back to Cart
                            </div>
                            <button
                                class="btn btn-primary"
                                :class="{ 'loading': customerLoading }"
                                @click.prevent="onUpdateContact()"
                            >
                                <span v-if="!customerLoading">Save and continue to Shipping</span>
                                <span v-if="customerLoading">Loading</span>
                            </button>
                        </div>
                    </form>
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
                                        @click.prevent="actionProps.submit(afterContactSubmit)"
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

        <template v-if="step === 'shipping'">
            <CheckoutShipping @update-after:shippingMethod="onUpdateShippingMethod()" />
        </template>

        <template v-if="step === 'payment'">
            <CheckoutPayment @update-after:paymentMethod="onUpdatePaymentMethod()" />
        </template>

        <template v-if="step === 'summary'">
            <div class="border border-base-300">
                <CartTotals />
            </div>

            <div class="form-control">
                <label for="order-comment" class="sr-only label">
                    <span class="label-text">Order comment</span>
                </label>
                <textarea id="order-comment" v-model="orderComment" class="textarea textarea-bordered border-base-300 h-24" placeholder="Order comment" />
            </div>

            <form ref="placeOrderForm" class="form-control gap-2">
                <label class="label cursor-pointer">
                    <input type="checkbox" required class="checkbox checkbox-primary mr-4">
                    <span class="label-text mr-auto">I agree to the terms and conditions as set out by the user agreement.</span>
                </label>

                <label class="label cursor-pointer">
                    <input type="checkbox" required class="checkbox checkbox-primary mr-4">
                    <span class="label-text mr-auto">I have read the privacy policy and I agree with them.</span>
                </label>

                <CheckoutPlaceOrder :form="placeOrderForm">
                    <template #actions="actionProps">
                        <div class="navigation flex justify-between items-center">
                            <div class="link link-hover link-accent" @click="selectStep('payment')">
                                Back to Payment
                            </div>
                            <button
                                type="submit"
                                :disabled="actionProps.loading"
                                :class="{ 'loading': actionProps.loading }"
                                class="btn btn-primary"
                                @click.prevent="actionProps.onSubmit()"
                            >
                                Place Order
                            </button>
                        </div>
                    </template>
                </CheckoutPlaceOrder>
            </form>
        </template>

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
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { definePageMeta, useCustomer, useCart, usePlatform, useCheckout, useNotification } from '#imports'
import { useForm } from '@hubblecommerce/hubble/commons'

definePageMeta({
    layout: 'checkout',
    middleware: 'validate-cart'
})

const placeOrderForm = ref()

/*
 * Checkout Step Navigation
 */
const step = ref('contact')
const { customer, loading: customerLoading, updateShippingAddress, updateBillingAddress, error } = useCustomer()
const { shippingError, paymentError, orderComment } = useCheckout()
const { showNotification } = useNotification()
const protectedSteps = [
    'shipping',
    'payment',
    'summary'
]

function selectStep (stepName: string): void {
    if (protectedSteps.includes(stepName) && !customer.value) {
        return
    }

    if ((stepName === 'payment' || stepName === 'summary') && shippingError.value) {
        showNotification('Please select a valid shipping method.', 'error')
        return
    }

    if (stepName === 'summary' && paymentError.value) {
        showNotification('Please select a valid payment method.', 'error')
        return
    }

    step.value = stepName
}

/*
 * Update Guest Shipping Address
 */
const { validateForm } = useForm()
const updateContactForm = ref()
async function onUpdateContact () {
    const isValid = await validateForm(updateContactForm.value)
    if (!isValid) {
        return
    }

    if (customer.value?.billingSameAsShipping) {
        await updateShippingAddress(customer.value.shippingAddress)

        const { id: billingAddressId } = customer.value.billingAddress
        const { id: shippingAddressId, ...shippingAddressData } = customer.value.shippingAddress

        await updateBillingAddress({
            id: billingAddressId,
            ...shippingAddressData
        })
    }

    if (!customer.value?.billingSameAsShipping) {
        await updateShippingAddress(customer.value.shippingAddress)
        await updateBillingAddress(customer.value.billingAddress)
    }

    if (error.value) {
        showNotification(error.value as string, 'error', true)
        return
    }

    await afterContactSubmit()
}

/*
 * Event handling (contact, shipping, payment)
 */
const { session, getSession } = usePlatform()
const { getCart } = useCart()

async function onUpdateShippingMethod () {
    await getSession()
    await getCart()
}

async function onUpdatePaymentMethod () {
    await getSession()
}

async function afterContactSubmit () {
    await getSession()
    selectStep('shipping')
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
