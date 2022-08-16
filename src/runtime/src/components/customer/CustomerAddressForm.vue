<template>
    <div class="grid grid-cols-12 gap-2">
        <div class="form-control col-span-12">
            <label for="register-salutation" class="label">
                <span class="label-text">Salutation</span>
            </label>

            <select id="register-salutation" v-model="form.salutation" required class="select select-bordered w-full">
                <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">
                    {{ salutation.name }}
                </option>
            </select>
        </div>

        <div class="form-control col-span-12 lg:col-span-6">
            <label for="register-firstName" class="label">
                <span class="label-text">Firstname</span>
            </label>
            <input
                id="register-firstName"
                v-model="form.firstName"
                required
                type="text"
                placeholder="Firstname"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12 lg:col-span-6">
            <label for="register-lastName" class="label">
                <span class="label-text">Lastname</span>
            </label>
            <input
                id="register-lastName"
                v-model="form.lastName"
                required
                type="text"
                placeholder="Lastname"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12">
            <label for="register-company" class="label">
                <span class="label-text">Company (optional)</span>
            </label>
            <input
                id="register-company"
                v-model="form.company"
                type="text"
                placeholder="Company (optional)"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12">
            <label for="register-street" class="label">
                <span class="label-text">Street and Number</span>
            </label>
            <input
                id="register-street"
                v-model="form.street"
                required
                type="text"
                placeholder="Street"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12 lg:col-span-4">
            <label for="register-zipcode" class="label">
                <span class="label-text">Zipcode</span>
            </label>
            <input
                id="register-zipcode"
                v-model="form.zipcode"
                required
                type="text"
                placeholder="Zipcode"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12 lg:col-span-8">
            <label for="register-city" class="label">
                <span class="label-text">City</span>
            </label>
            <input
                id="register-city"
                v-model="form.city"
                required
                type="text"
                placeholder="City"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12">
            <label for="register-country" class="label">
                <span class="label-text">Country</span>
            </label>
            <select id="register-country" v-model="form.country" required class="select select-bordered w-full">
                <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                </option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, computed } from 'vue'
import { usePlatform } from '#imports'
import { CustomerBillingAddress, CustomerShippingAddress } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    modelValue?: CustomerBillingAddress | CustomerShippingAddress
}>()
const emit = defineEmits(['update:modelValue'])

const form = computed({
    get () {
        return props.modelValue
    },
    set (value) {
        emit('update:modelValue', value)
    }
})

const { getSalutations, getCountries } = usePlatform()
const salutations = ref(null)
const countries = ref(null)
onMounted(() => {
    return nextTick(async () => {
        salutations.value = await getSalutations()
        countries.value = await getCountries()
    })
})
</script>
