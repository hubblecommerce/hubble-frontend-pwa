import { defineNuxtPlugin } from '#app'
import mitt from 'mitt'
const emitter = mitt()

/*
Usage:
const { $hblBus } = useNuxtApp()

$hblBus.$emit('somethingHappened', { data: value })

$hblBus.$on('somethingHappened', ({ data }) => {
    console.log(data)
})
*/

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('hblBus', {
        $on: emitter.on,
        $emit: emitter.emit,
        $off: emitter.off
    })
})
