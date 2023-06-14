import { defineNuxtPlugin } from '#app'
import mitt from 'mitt'
const emitter = mitt()

/*
Usage:
const { $hblBus } = useNuxtApp()

$hblBus.$emit('somethingHappened', { data: value })

$hblBus.$on('somethingHappened', eventListenerMediaGallery)

function eventListener ({ data }) {
    console.log(data)
}

Don't forget to unsubscribe on unmount
onBeforeUnmount(() => {
    $hblBus.$off('somethingHappened', eventListener)
})
*/

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('hblBus', {
        $on: emitter.on,
        $emit: emitter.emit,
        $off: emitter.off
    })
})
