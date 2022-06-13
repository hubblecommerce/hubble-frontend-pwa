<template>
    <div>
        <div>This component comes from hubble module</div>
        <button @click="onBtnClick()">
            Get Cart
        </button>

        <div v-text="cartData" />
    </div>
</template>

<script>
import { ref } from 'vue'
import { getCart } from '#imports'

export default {
    name: 'TestComponent',

    setup () {
        const cartData = ref({})

        const onBtnClick = async function () {
            cartData.value = await getCart()
        }

        return { onBtnClick, cartData }
    }
}
</script>

<style scoped>

</style>
