<template>
    <div>
        <div>This component comes from hubble module</div>
        <button @click="onClickGetCart()">
            Get Cart
        </button>

        <button @click="onClickDeleteCart()">
            Delete Cart
        </button>

        {{ cart }}
    </div>
</template>

<script setup>
import { useCart, usePlatform } from '#imports'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { cart, getCart, deleteCart, loading, error } = useCart()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onClickGetCart = async function () {
    await getCart()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onClickDeleteCart = async function () {
    await deleteCart()
}

const { sessionToken } = usePlatform()

if (sessionToken.value) {
    await getCart()
}
</script>

<style scoped>

</style>
