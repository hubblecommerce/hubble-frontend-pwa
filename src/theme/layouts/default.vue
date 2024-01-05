<template>
    <div
        class="default-layout"
        :class="{ 'drawer drawer-end': drawerDirection === 'right', 'drawer': drawerDirection === 'left' }"
        :style="!drawerState ? 'height:auto !important;' : ''"
    >
        <input id="default-layout-drawer" v-model="drawerState" type="checkbox" class="drawer-toggle">

        <div class="drawer-content relative">
            <misc-plugin-slot name="layouts-default-header-before" :events="{}" :data="{}" />
            <LayoutHeader />
            <misc-plugin-slot name="layouts-default-header-after" :events="{}" :data="{}" />

            <misc-plugin-slot name="layouts-default-content-before" :events="{}" :data="{}" />
            <slot />
            <misc-plugin-slot name="layouts-default-content-after" :events="{}" :data="{}" />

            <misc-plugin-slot name="layouts-default-footer-before" :events="{}" :data="{}" />
            <LayoutFooter />
            <misc-plugin-slot name="layouts-default-footer-after" :events="{}" :data="{}" />

            <LayoutNotifications />
            <client-only>
                <MiscLoadingBar ref="loading" />
            </client-only>
        </div>

        <div class="drawer-side z-50">
            <div class="drawer-overlay" @click="toggleDrawer()" />
            <div class="h-full px-6 py-3 overflow-y-auto w-full md:w-96 bg-base-100 text-base-content">
                <misc-plugin-slot name="layouts-default-drawer-overlay-before" :events="{}" :data="{}" />
                <LazyDrawerContextCart v-if="drawerContext === 'cart'" />
                <LazyDrawerContextWishlist v-if="drawerContext === 'wishlist'" />
                <LazyDrawerContextSearch v-if="drawerContext === 'search'" />
                <misc-plugin-slot name="layouts-default-drawer-overlay-after" :events="{}" :data="{}" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDrawer, useNuxtApp } from '#imports'

const loading = ref(null)
const nuxtApp = useNuxtApp()
const { drawerState, drawerContext, toggleDrawer, drawerDirection, closeDrawer } = useDrawer()

nuxtApp.hook('page:start', () => {
    // @ts-ignore
    loading.value?.start()
})

nuxtApp.hook('page:finish', () => {
    // @ts-ignore
    loading.value?.finish()
    window.scrollTo(0, 0)
    closeDrawer()
})
</script>

<style lang="postcss">
.page-enter-from{
    opacity: 0;
}

.page-enter-active,
.page-leave-active {
    transition: all 100ms;
}
.page-enter,
.page-leave-to {
    opacity: 0;
}
</style>
