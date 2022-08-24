<template>
    <div>
        <div>{{ sessionToken }}</div>
        <div>{{ isGuest }}</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref } from 'vue'
import { useAsyncData, navigateTo } from '#app'
import { usePlatform, useCart, useCustomer } from '#imports'

const { sessionToken, getSession } = usePlatform()
const { cart, getCart } = useCart()
const { customer } = useCustomer()

onMounted(() => {
    nextTick(async () => {
        await getCart()
    })
})

const { data, pending, error, refresh } = await useAsyncData(async () => {
    let cart
    let session

    await Promise.all([
        $fetch('http://localhost/store-api/checkout/cart', {
            headers: {
                'sw-access-key': 'SWSCRNJ4TDNLV0NUT01YMENSCA'
            }
        }),
        getSession()
    ]).then(([cartResponse, sesh]) => {
        cart = cartResponse
        session = sesh
    })

    return Object.assign(cart, session, { myData: 'some extra data' })
})

const isGuest = ref()
isGuest.value = data.value.isGuest

if (isGuest.value) {
    navigateTo('/')
}
</script>
