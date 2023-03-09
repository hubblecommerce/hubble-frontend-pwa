<template>
    <div class="checkout-page flex flex-col gap-8">
        <div class="w-full text-sm breadcrumbs">
            <ul>
                <li>
                    <MiscLink to="/cart">
                        {{ t('checkout.breadcrumb.cart') }}
                    </MiscLink>
                </li>
                <li class="link link-hover" :class="{ 'link-accent': step === 'contact'}" @click="selectStep('contact')">
                    {{ t('checkout.breadcrumb.contact') }}
                </li>
                <li class="link link-hover" :class="{ 'link-accent': step === 'shipping'}" @click="selectStep('shipping')">
                    {{ t('checkout.breadcrumb.shipping') }}
                </li>
                <li class="link link-hover" :class="{ 'link-accent': step === 'payment'}" @click="selectStep('payment')">
                    {{ t('checkout.breadcrumb.payment') }}
                </li>
                <li class="link link-hover" :class="{ 'link-accent': step === 'summary'}" @click="selectStep('summary')">
                    {{ t('checkout.breadcrumb.summary') }}
                </li>
            </ul>
        </div>

        <div v-if="step === 'summary'" class="text-xl pr-2 -mb-4">
            {{ t('checkout.summary.headline') }}
        </div>

        <div v-if="step !== 'contact'" class="flex flex-col p-2 border border-base-300 text-sm">
            <div class="grid grid-cols-12 gap-2">
                <div class="col-span-6 md:col-span-3 order-1">
                    {{ t('checkout.summary.contact') }}
                </div>
                <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                    {{ customer.email }}
                </div>
            </div>
            <div class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-base-300">
                <div class="col-span-6 md:col-span-3 order-1">
                    {{ t('checkout.summary.shipping.label') }} <span v-if="customer.billingSameAsShipping">/ {{ t('checkout.summary.billing.label') }}</span>
                </div>
                <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                    <CustomerAddressRenderer :address="customer.shippingAddress" />
                </div>
                <div class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start" @click="selectStep('contact')">
                    {{ t('checkout.summary.contact.edit') }}
                </div>
            </div>
            <div v-if="!customer.billingSameAsShipping" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-base-300">
                <div class="col-span-6 md:col-span-3 order-1">
                    {{ t('checkout.summary.billing.label') }}
                </div>
                <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                    <CustomerAddressRenderer :address="customer.billingAddress" />
                </div>
                <div class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start" @click="selectStep('contact')">
                    {{ t('checkout.summary.contact.edit') }}
                </div>
            </div>
            <div v-if="step === 'payment' || step === 'summary'" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-base-300">
                <div class="col-span-6 md:col-span-3 order-1">
                    {{ t('checkout.summary.shipping') }}
                </div>
                <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                    {{ session.shippingMethod.name }}
                </div>
                <div class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start" @click="selectStep('shipping')">
                    {{ t('checkout.summary.shipping.edit') }}
                </div>
            </div>
            <div v-if="step === 'summary'" class="grid grid-cols-12 gap-2 pt-2 mt-2 border-t border-base-300">
                <div class="col-span-6 md:col-span-3 order-1">
                    {{ t('checkout.summary.payment') }}
                </div>
                <div class="col-span-12 md:col-span-6 order-3 md:order-2">
                    {{ session.paymentMethod.name }}
                </div>
                <div class="link col-span-6 md:col-span-3 order-2 md:order-3 place-self-end self-start" @click="selectStep('payment')">
                    {{ t('checkout.summary.payment.edit') }}
                </div>
            </div>
        </div>

        <template v-if="step === 'contact'">
            <client-only>
                <template v-if="customer">
                    <form ref="updateContactForm" class="flex flex-col gap-8" @submit.prevent="onUpdateContact()">
                        <div class="flex flex-col flex-wrap gap-4">
                            <div class="text-xl pr-2">
                                {{ t('checkout.summary.contact') }}
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
                        </div>

                        <div class="flex flex-col flex-wrap gap-4">
                            <div class="text-xl pr-2">
                                {{ t('checkout.contact.shippingAddress.label') }}
                            </div>
                            <CustomerAddressForm id="shipping-address" v-model="customer.shippingAddress" />
                        </div>

                        <div class="flex flex-col flex-wrap gap-4">
                            <div class="text-xl pr-2">
                                {{ t('checkout.contact.billingAddress.label') }}
                            </div>

                            <div class="flex flex-col gap-3">
                                <label for="same-billing-address" class="flex justify-between items-center cursor-pointer">
                                    <input
                                        id="same-billing-address"
                                        v-model="customer.billingSameAsShipping"
                                        type="checkbox"
                                        class="checkbox checkbox-secondary w-6 mr-4"
                                    >
                                    <span class="mr-auto">{{ t('checkout.contact.billingSameAsShipping.label') }}</span>
                                </label>

                                <div v-if="!customer.billingSameAsShipping">
                                    <CustomerAddressForm id="billing-address" v-model="customer.billingAddress" />
                                </div>
                            </div>
                        </div>

                        <portal to="checkoutNavigation">
                            <div class="navigation flex flex-col flex-wrap justify-between items-center gap-4 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-2">
                                <MiscLink to="/cart" class="link link-hover cursor-pointer order-2 lg:order-1">
                                    {{ t('checkout.contact.navigation.back') }}
                                </MiscLink>
                                <button
                                    class="btn btn-primary w-full order-1 lg:w-auto lg:order-2"
                                    :class="{ 'loading': customerLoading }"
                                    :disabled="customerLoading"
                                    @click.prevent="onUpdateContact()"
                                >
                                    <span>{{ t('checkout.contact.navigation.forward') }}</span>
                                </button>
                            </div>
                        </portal>
                    </form>
                </template>

                <template v-else>
                    <Transition name="fade" appear>
                        <CustomerRegisterForm :guest-form="true">
                            <template #actions="actionProps">
                                <portal to="checkoutNavigation">
                                    <div class="navigation flex flex-col flex-wrap justify-between items-center gap-4 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-2">
                                        <div v-if="step === 'contact'" class="link link-hover cursor-pointer order-2 lg:order-1">
                                            {{ t('checkout.contact.navigation.back') }}
                                        </div>
                                        <button
                                            v-if="step === 'contact'"
                                            class="btn btn-primary w-full order-1 lg:w-auto lg:order-2"
                                            :class="{ 'loading': actionProps.loading }"
                                            :disabled="actionProps.loading"
                                            @click.prevent="actionProps.submit(afterContactSubmit)"
                                        >
                                            <span>{{ t('checkout.contact.navigation.forward') }}</span>
                                        </button>
                                    </div>
                                </portal>
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

        <client-only>
            <CheckoutShipping v-show="step === 'shipping'" :current-step="step" @update-after:shipping-method="onUpdateShippingMethod()" />
        </client-only>

        <client-only>
            <CheckoutPayment v-show="step === 'payment'" :key="paymentMethodKey" :current-step="step" @update-after:payment-method="onUpdatePaymentMethod($event)" />
        </client-only>

        <template v-if="step === 'summary'">
            <CartTotals />

            <div class="form-control">
                <label for="order-comment" class="sr-only label">
                    <span class="label-text">{{ t('checkout.summary.comment.placeholder') }}</span>
                </label>
                <textarea id="order-comment" v-model="orderComment" class="textarea textarea-bordered border-base-300 h-24" :placeholder="t('checkout.summary.comment.placeholder')" />
            </div>

            <form ref="placeOrderForm" class="form-control gap-2">
                <label class="label cursor-pointer">
                    <input type="checkbox" required class="checkbox checkbox-primary mr-4">
                    <span class="label-text mr-auto">{{ t('checkout.summary.tac') }}</span>
                </label>

                <label class="label cursor-pointer">
                    <input type="checkbox" required class="checkbox checkbox-primary mr-4">
                    <span class="label-text mr-auto">{{ t('checkout.summary.policy') }}</span>
                </label>

                <MiscPluginSlot
                    name="pages-checkout-place-order"
                    :data="{ form: placeOrderForm }"
                    :events="slotEvents"
                />

                <CheckoutPlaceOrder v-if="defaultPlaceOrder" :form="placeOrderForm">
                    <template #actions="actionProps">
                        <portal to="checkoutNavigation">
                            <div class="navigation flex flex-col flex-wrap justify-between items-center gap-4 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-2">
                                <div class="link link-hover cursor-pointer order-2 lg:order-1" @click="selectStep('payment')">
                                    {{ t('checkout.summary.navigation.back') }}
                                </div>
                                <button
                                    type="submit"
                                    :disabled="actionProps.loading"
                                    :class="{ 'loading': actionProps.loading }"
                                    class="btn btn-primary w-full order-1 lg:w-auto lg:order-2"
                                    @click.prevent="actionProps.onSubmit()"
                                >
                                    {{ t('checkout.summary.navigation.place.order') }}
                                </button>
                            </div>
                        </portal>
                    </template>
                </CheckoutPlaceOrder>
            </form>
        </template>

        <portal to="checkoutNavigation">
            <div v-if="step !== 'contact'" class="navigation flex flex-col flex-wrap justify-between items-center gap-4 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-2">
                <div v-if="step === 'shipping'" class="link link-hover cursor-pointer order-2 lg:order-1" @click="selectStep('contact')">
                    {{ t('checkout.shipping.navigation.back') }}
                </div>
                <div v-if="step === 'shipping'" class="btn btn-primary w-full order-1 lg:w-auto lg:order-2" @click="selectStep('payment')">
                    {{ t('checkout.shipping.navigation.forward') }}
                </div>

                <div v-if="step === 'payment'" class="link link-hover cursor-pointer order-2 lg:order-1" @click="selectStep('shipping')">
                    {{ t('checkout.payment.navigation.back') }}
                </div>
                <div v-if="step === 'payment'" class="btn btn-primary w-full order-1 lg:w-auto lg:order-2" @click="selectStep('summary')">
                    {{ t('checkout.payment.navigation.forward') }}
                </div>
            </div>
        </portal>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { definePageMeta, useCustomer, useCart, usePlatform, useCheckout, useNotification } from '#imports'
import { useForm, Customer } from '@hubblecommerce/hubble/commons'

definePageMeta({
    layout: 'checkout',
    middleware: 'validate-cart'
})

const { t } = useI18n()
const placeOrderForm = ref()

/*
 * Checkout Step Navigation
 */
const step = ref('contact')
const customerStore = useCustomer()
const { customer, loading: customerLoading, error } = storeToRefs(customerStore)
const { updateShippingAddress, updateBillingAddress } = customerStore
const { shippingError, paymentError, orderComment } = useCheckout()
const { showNotification } = useNotification()
const protectedSteps = [
    'shipping',
    'payment',
    'summary'
]
const paymentEmpty = ref(false)
const paymentMethodKey = ref(0)

function selectStep (stepName: string): void {
    if (protectedSteps.includes(stepName) && !customer.value) {
        return
    }

    if ((stepName === 'payment' || stepName === 'summary') && shippingError.value) {
        showNotification('Please select a valid shipping method.', 'error')
        return
    }

    if (stepName === 'summary' && (paymentError.value || paymentEmpty.value)) {
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
    if (!isValid || customer?.value?.shippingAddress == null || customer?.value?.billingAddress == null) {
        return
    }

    if (customer.value?.billingSameAsShipping) {
        await updateShippingAddress(customer?.value?.shippingAddress)

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

const platformStore = usePlatform()
const { session } = storeToRefs(platformStore)
const { getSession } = platformStore
const { getCart } = useCart()

async function onUpdateShippingMethod () {
    await getSession()
    paymentMethodKey.value++
    await getCart()
}

async function onUpdatePaymentMethod (value: string) {
    paymentEmpty.value = value == null || value === ''
    await getSession()
    defaultPlaceOrder.value = true
}

async function afterContactSubmit () {
    await getSession()
    selectStep('shipping')
}

/*
 * Plugins
 */
const defaultPlaceOrder = ref(true)

const slotEvents = ref({
    'update:defaultPlaceOrder': (bool: boolean) => { defaultPlaceOrder.value = bool },
    'update:selectStep': (string: string) => { step.value = string }
})
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<i18n>
{
    "en": {
        "checkout.breadcrumb.cart": "Cart",
        "checkout.breadcrumb.contact": "Contact",
        "checkout.breadcrumb.shipping": "Shipping",
        "checkout.breadcrumb.payment": "Payment",
        "checkout.breadcrumb.summary": "Summary",
        "checkout.summary.contact": "Contact",
        "checkout.summary.shipping": "Shipping",
        "checkout.summary.payment": "Payment",
        "checkout.summary.logout": "Not your account? Sign out",
        "checkout.contact.shippingAddress.label": "Shipping Address",
        "checkout.contact.billingAddress.label": "Billing Address",
        "checkout.contact.billingSameAsShipping.label": "The billing address corresponds to the delivery address.",
        "checkout.contact.navigation.back": "Back to cart",
        "checkout.contact.navigation.forward": "Save and continue to Shipping",
        "checkout.navigation.nocharge": "You will not be charged yet.",
        "checkout.shipping.navigation.back": "Back to Contact",
        "checkout.shipping.navigation.forward": "Save and continue to Payment",
        "checkout.payment.navigation.back": "Back to Shipping",
        "checkout.payment.navigation.forward": "Save and continue to Summary",
        "checkout.summary.navigation.back": "Back to Payment",
        "checkout.summary.navigation.place.order": "Place Order",
        "checkout.summary.headline": "Summary",
        "checkout.summary.contact.edit": "Edit",
        "checkout.summary.shipping.label": "Ship to",
        "checkout.summary.shipping.edit": "Edit",
        "checkout.summary.billing.label": "Billing to",
        "checkout.summary.billing.edit": "Edit",
        "checkout.summary.payment.edit": "Edit",
        "checkout.summary.comment.placeholder": "Order comment",
        "checkout.summary.tac": "I agree to the terms and conditions as set out by the user agreement.",
        "checkout.summary.policy": "I have read the privacy policy and I agree with them."
    },
    "de": {
        "checkout.breadcrumb.cart": "Warenkorb",
        "checkout.breadcrumb.contact": "Ihre Angaben",
        "checkout.breadcrumb.shipping": "Lieferung",
        "checkout.breadcrumb.payment": "Bezahlung",
        "checkout.breadcrumb.summary": "Zusammenfassung",
        "checkout.summary.contact": "Kontakt",
        "checkout.summary.shipping": "Lieferung",
        "checkout.summary.payment": "Bezahlung",
        "checkout.summary.logout": "Nicht Ihr Konto? Abmelden",
        "checkout.contact.shippingAddress.label": "Lieferadresse",
        "checkout.contact.billingAddress.label": "Rechnungsadresse",
        "checkout.contact.billingSameAsShipping.label": "Die Rechnungsadresse entspricht der Lieferadresse.",
        "checkout.contact.navigation.back": "Zurück zum Warenkorb",
        "checkout.contact.navigation.forward": "Speichern und weiter zur Lieferung",
        "checkout.navigation.nocharge": "Ihnen wird noch nichts berechnet.",
        "checkout.shipping.navigation.back": "Zurück zu Ihren Angaben",
        "checkout.shipping.navigation.forward": "Speichern und weiter zu Bezahlung",
        "checkout.payment.navigation.back": "Zurück zu Lieferung",
        "checkout.payment.navigation.forward": "Bestellung überprüfen",
        "checkout.summary.navigation.back": "Zurück zu Bezahlung",
        "checkout.summary.navigation.place.order": "Zahlungspflichtig bestellen",
        "checkout.summary.headline": "Zusammenfassung",
        "checkout.summary.contact.edit": "Ändern",
        "checkout.summary.shipping.label": "Lieferadresse",
        "checkout.summary.shipping.edit": "Ändern",
        "checkout.summary.billing.label": "Rechnungsadresse",
        "checkout.summary.billing.edit": "Ändern",
        "checkout.summary.payment.edit": "Ändern",
        "checkout.summary.comment.placeholder": "Kommentar zur Bestellung...",
        "checkout.summary.tac": "Ich habe die AGB Ihres Shops gelesen und bin mit deren Geltung einverstanden.",
        "checkout.summary.policy": "Ich habe die Datenschutzerklärung Ihres Shops gelesen und akzeptiert."
    }
}
</i18n>
