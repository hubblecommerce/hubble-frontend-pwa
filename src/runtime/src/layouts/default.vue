<template>
    <div
        class="default-layout"
        :class="{ 'drawer drawer-end': drawerDirection === 'right', 'drawer': drawerDirection === 'left' }"
        :style="!drawerState ? 'height: auto !important;' : ''"
    >
        <input id="default-layout-drawer" v-model="drawerState" type="checkbox" class="drawer-toggle">

        <div class="drawer-content relative">
            <LayoutHeader />
            <slot />
            <LayoutFooter />
            <LayoutNotifications />
        </div>

        <div class="drawer-side">
            <div class="drawer-overlay" @click="toggleDrawer()" />
            <div class="px-6 py-3 overflow-y-auto w-full md:w-96 bg-base-100 text-base-content">
                <LazyDrawerContextCart v-if="drawerContext === 'cart'" />
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
