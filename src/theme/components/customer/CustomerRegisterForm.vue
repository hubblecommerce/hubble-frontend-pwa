<template>
    <form ref="registerForm" class="customer-register-form flex flex-col gap-8" @submit.prevent="onSubmit">
        <div class="flex flex-wrap gap-3">
            <h4>{{ t('customer.register.form.contactTitle') }}</h4>

            <div class="form-control w-full">
                <label for="register-email" class="label">
                    <span class="label-text">{{ t('customer.register.form.email.label') }}</span>
                </label>
                <input
                    id="register-email"
                    v-model="email"
                    required
                    type="email"
                    inputmode="email"
                    :placeholder="t('customer.register.form.email.placeholder')"
                    class="input input-bordered w-full"
                >
            </div>

            <div v-if="guestForm" class="form-control">
                <label class="label cursor-pointer">
                    <input v-model="createAccount" type="checkbox" checked="checked" class="checkbox mr-2">
                    <span class="label-text">{{ t('customer.register.form.createAccount') }}</span>
                </label>
            </div>

            <div v-if="createAccount" class="form-control w-full">
                <div class="grid grid-cols-2 gap-3 lg:gap-6">
                    <div class="col-span-2 lg:col-span-1">
                        <label for="register-password" class="label">
                            <span class="label-text">{{ t('customer.register.form.password.label') }}</span>
                        </label>
                        <div class="input-group">
                            <input
                                id="register-password"
                                v-model="password"
                                required
                                :type="showPassword ? 'text' : 'password'"
                                :placeholder="t('customer.register.form.password.placeholder')"
                                class="input input-bordered w-full border-r-0"
                            >
                            <div class="btn btn-square" tabindex="0" @click="showPassword = !showPassword" @keypress.space.prevent="showPassword = !showPassword">
                                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                                <EyeSlashIcon v-else class="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div class="col-span-2 lg:col-span-1">
                        <label for="register-password-repeat" class="label">
                            <span class="label-text">{{ t('customer.register.form.passwordRepeat.label') }}</span>
                        </label>
                        <div class="input-group">
                            <input
                                id="register-password-repeat"
                                ref="passwordRepeatInput"
                                v-model="passwordRepeat"
                                required
                                :type="showPassword ? 'text' : 'password'"
                                :placeholder="t('customer.register.form.passwordRepeat.placeholder')"
                                class="input input-bordered w-full border-r-0"
                            >
                            <div class="btn btn-square" @click="showPassword = !showPassword" @keypress.space.prevent="showPassword = !showPassword">
                                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                                <EyeSlashIcon v-else class="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="createAccount" class="form-control w-full">
                <div class="col-span-2 lg:col-span-1">
                    <label for="register-dob" class="label">
                        <span class="label-text">{{ t('customer.register.form.dob.label') }}</span>
                    </label>
                    <div class="input-group">
                        <input
                            id="register-dob"
                            ref="dobInput"
                            v-model="dateOfBirth"
                            type="date"
                            class="input input-bordered w-full border-r-0"
                        >
                        <div class="btn btn-square" @click="dobInput.showPicker()">
                            <CalendarIcon class="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col">
            <div class="flex flex-wrap gap-3">
                <h4>{{ t('customer.register.form.shippingTitle') }}</h4>
                <CustomerAddressForm id="registerShippingAddress" v-model="shippingAddress" class="w-full" />
            </div>
        </div>

        <div v-show="alternateBillingAddress" class="flex flex-col">
            <div class="flex flex-wrap gap-6">
                <h4>{{ t('customer.register.form.billingTitle') }}</h4>
                <div class="w-full flex flex-col gap-3">
                    <label for="same-billing-address" class="flex justify-between items-center cursor-pointer">
                        <input
                            id="same-billing-address"
                            v-model="billingSameAsShipping"
                            :value="true"
                            type="checkbox"
                            class="checkbox checkbox-secondary w-6 mr-4"
                        >
                        <span class="mr-auto">{{ t('customer.register.form.billingSameAsShipping.label') }}</span>
                    </label>

                    <div v-if="!billingSameAsShipping">
                        <CustomerAddressForm id="registerBillingAddress" v-model="billingAddress" />
                    </div>
                </div>
            </div>
        </div>

        <slot name="actions" :submit="onSubmit" :loading="loading" />
    </form>
</template>

<script setup lang="ts">
import { ref, type Ref, withDefaults } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from '#app'
import { EyeIcon, EyeSlashIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { type HblCustomerBillingAddress, type HblCustomerShippingAddress } from '@/utils/types'
import { hblUseForm } from '@/utils/helper'
import { useCustomer } from '#imports'

const { t } = useI18n()

type CustomerRegisterFormProps = {
    guestForm?: boolean
    alternateBillingAddress?: boolean
}

const props = withDefaults(defineProps<CustomerRegisterFormProps>(), {
    guestForm: false,
    alternateBillingAddress: true
})

const registerForm = ref()
const email = ref('')
const password = ref('')
const passwordRepeatInput = ref()
const passwordRepeat = ref('')
const dobInput = ref()
const dateOfBirth = ref('')
 
const createAccount = ref(!props.guestForm)
const billingSameAsShipping = ref(true)
const shippingAddress: Ref<HblCustomerShippingAddress> = ref({
    id: '',
    salutation: '',
    firstName: '',
    lastName: '',
    street: '',
    zipcode: '',
    city: '',
    country: '',
    phone: ''
})
const billingAddress: Ref<HblCustomerBillingAddress> = ref({
    id: '',
    salutation: '',
    firstName: '',
    lastName: '',
    street: '',
    zipcode: '',
    city: '',
    country: '',
    phone: ''
})

const emit = defineEmits(['form-submitted'])
const customerStore = useCustomer()
const { error } = storeToRefs(customerStore)
const { register } = customerStore
const { validateForm } = hblUseForm()
const loading = ref(false)
const showPassword = ref(false)
const { $hblBus } = useNuxtApp()

async function onSubmit (callback: CallableFunction): Promise<void> {
    loading.value = true

    if (createAccount.value) {
        if (password.value !== passwordRepeat.value) {
            passwordRepeatInput.value.setCustomValidity(t('customer.register.form.passwordMismatch'))
        } else {
            passwordRepeatInput.value.setCustomValidity('')
        }
    }

    const isValid = await validateForm(registerForm.value)
    if (!isValid) {
        loading.value = false
        return
    }

    try {
        await register({
            email: email.value,
            ...(createAccount.value && { password: password.value }),
            ...(createAccount.value && { dateOfBirth: dateOfBirth.value }),
            createAccount: createAccount.value,
            billingSameAsShipping: billingSameAsShipping.value,
            shippingAddress,
            billingAddress
        })

        emit('form-submitted')
        $hblBus.$emit('register')

        loading.value = false
        return callback()
    } catch (e) {
        loading.value = false
    }
}
</script>

<style lang="postcss">
#register-dob[type="date"]::-webkit-inner-spin-button,
#register-dob[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}
</style>

<i18n>
{
    "en": {
        "customer.register.form.contactTitle": "Contact Information",
        "customer.register.form.email.label": "Email",
        "customer.register.form.email.placeholder": "Enter email",
        "customer.register.form.createAccount": "Create an account",
        "customer.register.form.password.label": "Password",
        "customer.register.form.password.placeholder": "Enter password",
        "customer.register.form.passwordRepeat.label": "Repeat password",
        "customer.register.form.passwordRepeat.placeholder": "Repeat password",
        "customer.register.form.dob.label": "Date of birth (optional)",
        "customer.register.form.shippingTitle": "Shipping address",
        "customer.register.form.billingTitle": "Billing address",
        "customer.register.form.billingSameAsShipping.label": "The billing address corresponds to the delivery address.",
        "customer.register.form.passwordMismatch": "Password don't match"
    },
    "de": {
        "customer.register.form.contactTitle": "Kontaktinformationen",
        "customer.register.form.email.label": "E-Mail",
        "customer.register.form.email.placeholder": "E-Mail Adresse eingeben...",
        "customer.register.form.createAccount": "Kundenkonto erstellen",
        "customer.register.form.password.label": "Passwort",
        "customer.register.form.password.placeholder": "Passwort wählen...",
        "customer.register.form.passwordRepeat.label": "Passwort wiederholen",
        "customer.register.form.passwordRepeat.placeholder": "Passwort erneut eingeben...",
        "customer.register.form.dob.label": "Geburtsdatum (optional)",
        "customer.register.form.shippingTitle": "Lieferadresse",
        "customer.register.form.billingTitle": "Rechnungsadresse",
        "customer.register.form.billingSameAsShipping.label": "Die Rechnungsadresse entspricht der Lieferadresse.",
        "customer.register.form.passwordMismatch": "Passwörter stimmen nicht überein"
    }
}
</i18n>
