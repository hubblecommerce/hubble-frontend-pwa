<template>
    <slot name="actions" :place-order="placeOrder" />
</template>

<script setup lang="ts">

function placeOrder () {
    console.log('place order')
}
</script>
