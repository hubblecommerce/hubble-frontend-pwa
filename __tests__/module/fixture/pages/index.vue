<template>
    <div>
        <Head>
            <Title>Module fixture</Title>
        </Head>
        <client-only>hydration: true</client-only>
        <div>Load composable from appropriate platform: {{ apiUrl }}</div>
        <div>Load overridden composable from project root: {{ additionalRef }}</div>
        <div>RuntimeConfig | meta.category.title: {{ config.meta.category.title }}</div>
        <div>RuntimeConfig | testPluginConfig1: {{ config.testPluginConfig1 }}</div>
        <div>RuntimeConfig | testPluginConfig2: {{ config.testPluginConfig2 }}</div>
        <MiscModuleTestComponent />
        <MiscSkeleton />
        <ProductDetailPlugin />
        <div>{{ t('index.translationTest') }}</div>
        <MiscPluginSlot name="test-plugin-slot" :data="{}" :events="{}" />
        <div id="tailwind-utility" class="text-black">
            TailwindCSS Test
        </div>
        <div id="daisyui-utility" class="btn">
            DaisyUI Component
        </div>
        <div id="overridden-daisyui-utility" class="btn text-black">
            Overridden DaisyUI Component
        </div>

        <!-- Pinia Store Test -->
        <div>Pinia Store - Cart Loading: {{ cartLoading }}</div>

        <!-- VueUse Test -->
        <div>VueUse Test - Counter: {{ counter }}</div>

        <!-- Platform Languages Test -->
        <div>Platform Languages Count: {{ platformLanguagesCount }}</div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useNotification, usePlatform, useCart } from '#imports'
import { useCounter } from '@vueuse/core'

const { apiUrl } = usePlatform()
const { additionalRef } = useNotification()
const config = useRuntimeConfig().public
const { t } = useI18n()

// Test Pinia store functionality - access reactive property from store
const cartStore = useCart()
const cartLoading = cartStore.loading

// Test VueUse composable - deterministic behavior
const { count: counter } = useCounter(5)

// Test platform languages from runtime config
const platformLanguagesCount = Array.isArray(config.platformLanguages) ? config.platformLanguages.length : 'undefined'
</script>

<i18n>
{
    "en": {
        "index.translationTest": "Test translation"
    },
    "de": {
        "index.translationTest": "Test Übersetzung"
    }
}
</i18n>
