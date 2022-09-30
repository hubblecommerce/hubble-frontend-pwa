<template>
    <div>{{ salutation }} {{ address.firstName }} {{ address.lastName }}</div>
    <div>{{ address.street }}</div>
    <div>{{ address.zipcode }} {{ address.city }}</div>
    <div v-if="country != null">
        {{ country }}
    </div>
    <MiscSkeleton v-else size="small" width="100px" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlatform } from '#imports'
import { CustomerBillingAddress, CustomerShippingAddress } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    address: CustomerBillingAddress | CustomerShippingAddress
}>()

const platformStore = usePlatform()
const { salutations, countries } = storeToRefs(platformStore)
const { getSalutations, getCountries } = usePlatform()

onMounted(async () => {
    if (salutations.value === null) {
        await getSalutations()
    }

    if (countries.value === null) {
        await getCountries()
    }
})

const salutation = computed(() => {
    const match = salutations.value?.find((entry) => {
        return entry.id === props.address.salutation
    })

    if (match != null) {
        return match.name
    }

    return null
})

const country = computed(() => {
    const match = countries.value?.find((entry) => {
        return entry.id === props.address.country
    })

    if (match != null) {
        return match.name
    }

    return null
})
</script>
