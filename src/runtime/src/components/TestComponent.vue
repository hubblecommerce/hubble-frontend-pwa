<template>
    <div>
        <div>This component comes from hubble module</div>
        <button @click="onClickGetCart()">
            Get Cart
        </button>

        <button @click="onClickClearSession()">
            Clear
        </button>

        <div v-text="`Current session token: ${sessionToken}`" />

        <div v-text="cart" />
    </div>
</template>

<script>
import { useCart, usePlatform } from '#imports'

export default {
    name: 'TestComponent',

    setup () {
        const { cart, getCart } = useCart()
        const { sessionToken, setSessionToken } = usePlatform()

        const onClickGetCart = async function () {
            cart.value = await getCart()
        }

        const onClickClearSession = function () {
            setSessionToken(null)
        }

        return { onClickGetCart, cart, sessionToken, onClickClearSession }
    }
}
</script>

<style scoped>

</style>
