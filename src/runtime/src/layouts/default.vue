<template>
    <div class="default-layout" :class="{ 'drawer drawer-end': drawerDirection === 'right', 'drawer': drawerDirection === 'left' }">
        <input id="default-layout-drawer" v-model="drawerState" type="checkbox" class="drawer-toggle">

        <div class="drawer-content relative">
            <LayoutHeader />
            <slot />
            <LayoutFooter />
            <LayoutNotifications />
        </div>

        <div class="drawer-side">
            <div class="drawer-overlay" @click="toggleDrawer()" />
            <div tabindex="-1" class="cart p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
                <LazyCartList v-if="drawerContext === 'cart'" />
                <LazySearchQuick v-if="drawerContext === 'search'" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import { useDrawer } from '#imports'

const nuxtApp = useNuxtApp()
const { drawerState, drawerContext, toggleDrawer, drawerDirection } = useDrawer()

nuxtApp.hook('page:finish', () => {
    window.scrollTo(0, 0)
})
</script>

<style scoped>

</style>
