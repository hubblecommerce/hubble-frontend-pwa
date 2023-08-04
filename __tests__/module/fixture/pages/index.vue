<template>
    <div>
        <Head>
            <Title>Module fixture</Title>
        </Head>
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
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useNotification, usePlatform } from '#imports'

const { apiUrl } = usePlatform()
const { additionalRef } = useNotification()
const config = useRuntimeConfig().public
const { t } = useI18n()
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
