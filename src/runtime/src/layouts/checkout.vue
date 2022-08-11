<template>
    <div>
        <main class="checkout-layout grid grid-cols-1 lg:grid-cols-12 lg:min-h-screen">
            <div class="sidebar lg:col-span-5 order-1 lg:order-2 p-2 lg:p-16 bg-base-300">
                <div class="flex flex-col lg:gap-4 w-full lg:max-w-md">
                    <nuxt-link to="/" class="btn btn-ghost normal-case text-xl p-0">
                        hubble PWA
                    </nuxt-link>

                    <div class="collapse collapse-arrow lg:collapse-open">
                        <input type="checkbox" class="lg:hidden">
                        <div class="lg:hidden collapse-title font-medium">
                            Show Order Summary
                        </div>
                        <div class="collapse-content flex flex-col gap-4">
                            <client-only>
                                <Cart :is-interactive="false" />
                            </client-only>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content lg:col-span-7 order-2 lg:order-1 container mx-auto p-4 lg:p-16 bg-base-100">
                <div class="w-full lg:max-w-xl lg:ml-auto">
                    <slot />
                </div>
            </div>
        </main>
        <LayoutFooterLight />
    </div>
</template>

<script setup lang="ts">

</script>
