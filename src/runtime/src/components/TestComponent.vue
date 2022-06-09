<template>
    <div>
        <div>This component comes from hubble module</div>
        <button @click="onBtnClick()">
            Get Cart
        </button>

        {{ cartData }}
    </div>
</template>

<script>
import { getCart } from '../composables/getCart'

export default {
    name: 'TestComponent',

    setup () {
        const cartData = ref({})

        const onBtnClick = function () {
            cartData.value = getCart()
        }

        return { onBtnClick, cartData }
    }
}
</script>

<style scoped>

</style>
