<template>
    <div class="grid grid-cols-12 gap-2">
        <div class="form-control col-span-12">
            <label :for="`${id}-salutation`" class="label">
                <span class="label-text">Salutation</span>
            </label>

            <select :id="`${id}-salutation`" v-model="form.salutation" required class="select select-bordered w-full">
                <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">
                    {{ salutation.name }}
                </option>
            </select>
        </div>

        <div class="form-control col-span-12 lg:col-span-6">
            <label :for="`${id}-firstName`" class="label">
                <span class="label-text">Firstname</span>
            </label>
            <input
                :id="`${id}-firstName`"
                v-model="form.firstName"
                required
                type="text"
                placeholder="Firstname"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12 lg:col-span-6">
            <label :for="`${id}-lastName`" class="label">
                <span class="label-text">Lastname</span>
            </label>
            <input
                :id="`${id}-lastName`"
                v-model="form.lastName"
                required
                type="text"
                placeholder="Lastname"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12">
            <label :for="`${id}-company`" class="label">
                <span class="label-text">Company (optional)</span>
            </label>
            <input
                :id="`${id}-company`"
                v-model="form.company"
                type="text"
                placeholder="Company (optional)"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12">
            <label :for="`${id}-street`" class="label">
                <span class="label-text">Street and Number</span>
            </label>
            <input
                :id="`${id}-street`"
                v-model="form.street"
                required
                type="text"
                placeholder="Street"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12 lg:col-span-4">
            <label :for="`${id}-zipcode`" class="label">
                <span class="label-text">Zipcode</span>
            </label>
            <input
                :id="`${id}-zipcode`"
                v-model="form.zipcode"
                required
                type="text"
                placeholder="Zipcode"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12 lg:col-span-8">
            <label :for="`${id}-city`" class="label">
                <span class="label-text">City</span>
            </label>
            <input
                :id="`${id}-city`"
                v-model="form.city"
                required
                type="text"
                placeholder="City"
                class="input input-bordered w-full"
            >
        </div>

        <div class="form-control col-span-12">
            <label :for="`${id}-country`" class="label">
                <span class="label-text">Country</span>
            </label>
            <select :id="`${id}-country`" v-model="form.country" required class="select select-bordered w-full">
                <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                </option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePlatform } from '#imports'
import { CustomerBillingAddress, CustomerShippingAddress } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    id?: string,
    modelValue?: CustomerBillingAddress | CustomerShippingAddress,
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

const { salutations, getSalutations, countries, getCountries } = usePlatform()
onMounted(async () => {
    if (salutations.value == null) {
        salutations.value = await getSalutations()
    }

    if (countries.value == null) {
        countries.value = await getCountries()
    }
})
</script>
