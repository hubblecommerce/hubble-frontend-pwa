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

        <div v-if="loading">
            Loading...
        </div>
        <div v-else-if="error">
            {{ error }}
        </div>
        <div v-else v-text="cart" />
    </div>
</template>

<script>
import { useCart, usePlatform } from '#imports'

export default {
    name: 'TestComponent',

    setup () {
        const { cart, getCart, loading, error } = useCart()
        const { sessionToken, setSessionToken } = usePlatform()

        const onClickGetCart = async function () {
            cart.value = await getCart()
        }

        const onClickClearSession = function () {
            setSessionToken(null)
        }

        return {
            onClickGetCart,
            cart,
            sessionToken,
            onClickClearSession,
            loading,
            error
        }
    }
}
</script>

<style scoped>

</style>
