<template>
    <div>
        <div>This component comes from hubble module</div>
        <button @click="onBtnClick()">
            Get Cart
        </button>

        <div v-text="cart" />
    </div>
</template>

<script>
import { useCart } from '#imports'

export default {
    name: 'TestComponent',

    setup () {
        const { cart, getCart } = useCart()

        const onBtnClick = async function () {
            cart.value = await getCart()
        }

        return { onBtnClick, cart }
    }
}
</script>

<style scoped>

</style>
