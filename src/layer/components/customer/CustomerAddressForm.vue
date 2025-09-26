<template>
    <div class="grid grid-cols-12 gap-2">
        <fieldset class="fieldset col-span-12">
            <label :for="`${id}-salutation`" class="label">Salutation</label>

            <select :id="`${id}-salutation`" v-model="form.salutation" required class="select w-full">
                <option v-for="salutation in salutations" :key="salutation.id" :value="salutation.id">
                    {{ salutation.name }}
                </option>
            </select>
        </fieldset>

        <fieldset class="fieldset col-span-12 lg:col-span-6">
            <label :for="`${id}-firstName`" class="label">Firstname</label>
            <input
                :id="`${id}-firstName`"
                v-model="form.firstName"
                required
                type="text"
                placeholder="Firstname"
                class="input w-full"
            >
        </fieldset>

        <fieldset class="fieldset col-span-12 lg:col-span-6">
            <label :for="`${id}-lastName`" class="label">Lastname</label>
            <input
                :id="`${id}-lastName`"
                v-model="form.lastName"
                required
                type="text"
                placeholder="Lastname"
                class="input w-full"
            >
        </fieldset>

        <fieldset class="fieldset col-span-12">
            <label :for="`${id}-company`" class="label">Company (optional)</label>
            <input
                :id="`${id}-company`"
                v-model="form.company"
                type="text"
                placeholder="Company (optional)"
                class="input w-full"
            >
        </fieldset>

        <fieldset class="fieldset col-span-12">
            <label :for="`${id}-street`" class="label">Street and Number</label>
            <input
                :id="`${id}-street`"
                v-model="form.street"
                required
                type="text"
                placeholder="Street"
                class="input w-full"
            >
        </fieldset>

        <fieldset class="fieldset col-span-12 lg:col-span-4">
            <label :for="`${id}-zipcode`" class="label">Zipcode</label>
            <input
                :id="`${id}-zipcode`"
                v-model="form.zipcode"
                required
                type="text"
                placeholder="Zipcode"
                class="input w-full"
            >
        </fieldset>

        <fieldset class="fieldset col-span-12 lg:col-span-8">
            <label :for="`${id}-city`" class="label">City</label>
            <input
                :id="`${id}-city`"
                v-model="form.city"
                required
                type="text"
                placeholder="City"
                class="input w-full"
            >
        </fieldset>

        <fieldset class="fieldset col-span-12">
            <label :for="`${id}-country`" class="label">Country</label>
            <select :id="`${id}-country`" v-model="form.country" required class="select w-full">
                <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                </option>
            </select>
        </fieldset>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlatform } from '#imports'
import { type HblCustomerBillingAddress, type HblCustomerShippingAddress } from '../../types'

const props = defineProps<{
    id?: string,
    modelValue?: HblCustomerBillingAddress | HblCustomerShippingAddress,
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

const platformStore = usePlatform()
const { salutations, countries } = storeToRefs(platformStore)
const { getSalutations, getCountries } = platformStore

onMounted(async () => {
    if (salutations.value == null) {
        salutations.value = await getSalutations()
    }

    if (countries.value == null) {
        countries.value = await getCountries()
    }
})
</script>
