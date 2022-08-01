<template>
    <div class="default-layout">
        <header>
            <misc-plugin-slot name="layouts-default-navbar-before" :events="{}" :data="{}">
                This is a Fallback Text, in case there is no component matches this slot.
            </misc-plugin-slot>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container">
                    <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarTogglerDemo01"
                        aria-controls="navbarTogglerDemo01"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span class="navbar-toggler-icon" />
                    </button>
                    <div id="navbarTogglerDemo01" class="collapse navbar-collapse">
                        <nuxt-link to="/" class="navbar-brand">
                            Home
                        </nuxt-link>
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li v-for="entry in navigation" :key="entry.id" class="nav-item">
                                <NuxtLink :to="entry.url" class="nav-link">
                                    {{ entry.name }}
                                </NuxtLink>
                            </li>
                        </ul>

                        <ul class="navbar-nav mb-2 mb-lg-0">
                            <li class="nav-item">
                                <NuxtLink to="/customer" class="nav-link">
                                    Customer
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink to="/customer/login" class="nav-link">
                                    Login
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink to="/navigation/19ca405790ff4f07aac8c599d43178686" class="nav-link">
                                    404
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { throwError } from '#app'
import { useNavigation } from '#imports'

const {
    navigation,
    getNavigation
} = useNavigation()

try {
    await getNavigation()
} catch (e) {
    throwError(e)
}
</script>

<style scoped>

</style>
