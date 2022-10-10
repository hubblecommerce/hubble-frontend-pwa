<template>
    <div class="bg-base-100">
        <div class="from-primary to-secondary text-primary-content grid place-items-center items-end bg-gradient-to-br">
            <div class="hero-content col-start-1 row-start-1 w-full flex-col justify-between gap-10 lg:flex-row lg:items-end lg:gap-0 xl:gap-20">
                <div class="lg:pl-10 lg:pb-64 lg:pt-16">
                    <div class="mb-2 py-4 text-center lg:py-10 lg:text-left">
                        <h1 class="font-title mb-2 text-4xl font-extrabold sm:text-5xl lg:text-7xl">
                            {{ t('hubble PWA') }}
                        </h1>
                        <h2 class="font-title text-lg font-extrabold sm:text-2xl lg:text-3xl">
                            The interface for your headless E-Commerce Platform
                        </h2>
                    </div>
                    <div class="flex w-full flex-col items-center space-y-10 lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0">
                        <div class="my-2 flex max-w-sm flex-col gap-2 text-left">
                            <div class="flex gap-2">
                                <CheckCircleIcon class="h-6 w-6" />
                                An open source project
                            </div>
                            <div class="flex gap-2">
                                <CheckCircleIcon class="h-6 w-6" />
                                Installable as a Nuxt.js Module
                            </div>
                            <div class="flex gap-2">
                                <CheckCircleIcon class="h-6 w-6" />
                                Compatible with Shopware 6
                            </div>
                            <div class="flex gap-2">
                                <CheckCircleIcon class="h-6 w-6" />
                                Covers all common e-commerce features
                            </div>
                            <div class="flex gap-2">
                                <CheckCircleIcon class="h-6 w-6" />
                                Excellent performance and usability
                            </div>
                        </div>
                        <div class="mockup-code border-base-content w-full flex-1 max-w-xs lg:max-w-none border-2 border-opacity-20 bg-transparent pb-6 text-left text-current lg:mx-0">
                            <pre data-prefix="$"><code>npx @hubblecommerce/launcher &lt;project-name&gt;</code></pre>
                        </div>
                    </div>
                    <div class="mt-4 flex flex-1 justify-center space-x-2 lg:mt-6 lg:justify-start">
                        <MiscLink no-prefetch to="/navigation/a515ae260223466f8e37471d279e6406" class="btn btn-ghost btn-active lg:btn-lg normal-case">
                            Shop cloths
                        </MiscLink>
                        <MiscLink no-prefetch to="/customer/login" class="btn lg:btn-lg normal-case">
                            Login
                        </MiscLink>
                    </div>
                </div>
            </div>
            <svg
                class="fill-secondary col-start-1 row-start-1 h-auto w-full"
                width="1600"
                height="595"
                viewBox="0 0 1600 595"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M0 338L53.3 349.2C106.7 360.3 213.3 382.7 320 393.8C426.7 405 533.3 405 640 359.3C746.7 313.7 853.3 222.3 960 189.2C1066.7 156 1173.3 181 1280 159.2C1386.7 137.3 1493.3 68.7 1546.7 34.3L1600 0V595H1546.7C1493.3 595 1386.7 595 1280 595C1173.3 595 1066.7 595 960 595C853.3 595 746.7 595 640 595C533.3 595 426.7 595 320 595C213.3 595 106.7 595 53.3 595H0V338Z" />
            </svg>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useRuntimeConfig } from '#imports'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const config = useRuntimeConfig().public

const { t } = useI18n()
</script>

<i18n>
{
    "en": {
        "hubble PWA": "hubble PWA"
    }
}
</i18n>
