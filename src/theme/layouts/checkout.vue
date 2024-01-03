<template>
    <div class="checkout-layout">
        <main class="grid grid-cols-1 lg:grid-cols-12 lg:min-h-screen">
            <div class="sidebar lg:col-span-5 order-1 lg:order-2 p-2 lg:px-16 lg:py-10 bg-base-300">
                <div class="flex flex-col lg:gap-4 w-full lg:max-w-md">
                    <MiscLink to="/" class="btn btn-ghost normal-case text-xl p-0">
                        hubble PWA
                    </MiscLink>

                    <div class="collapse collapse-arrow lg:collapse-open">
                        <input type="checkbox" class="lg:hidden">
                        <div class="lg:hidden collapse-title font-medium" v-text="t('checkout.summary.toggle.label')" />
                        <div class="collapse-content flex flex-col gap-4">
                            <Cart :is-interactive="false" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="content lg:col-span-7 order-2 lg:order-1 container mx-auto p-4 lg:px-16 lg:py-10">
                <div class="w-full lg:max-w-xl lg:ml-auto">
                    <slot />
                </div>
            </div>
        </main>
        <div class="w-full grid grid-cols-1 lg:sticky lg:left-0 lg:bottom-0 lg:grid-cols-12 lg:bg-base-300">
            <div class="p-4 lg:col-span-7 lg:py-4 lg:px-16 lg:border-t lg:border-r lg:border-base-content lg:bg-base-100">
                <div class="lg:max-w-xl lg:ml-auto">
                    <portal-target name="checkoutNavigation" />
                </div>
            </div>
        </div>
        <LayoutFooterLight />
        <LayoutNotifications />
        <client-only>
            <MiscLoadingBar ref="loading" />
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from '#imports'

const { t } = useI18n()
const nuxtApp = useNuxtApp()
const loading = ref(null)

nuxtApp.hook('page:start', () => {
    // @ts-ignore
    loading.value?.start()
})

nuxtApp.hook('page:finish', () => {
    // @ts-ignore
    loading.value?.finish()
    window.scrollTo(0, 0)
})

onMounted(() => {
    nuxtApp.$hblBus.$emit('viewCheckout')
})
</script>

<i18n>
{
    "en": {
        "checkout.summary.toggle.label": "Display order overview"
    },
    "de": {
        "checkout.summary.toggle.label": "Bestellübersicht anzeigen"
    }
}
</i18n>
