<template>
    <div>
        <header>
            <div v-for="entry in navigation" :key="entry.id">
                <NuxtLink :to="entry.url">
                    {{ entry.name }}
                </NuxtLink>

                <template v-if="entry.children.length > 0">
                    <div v-for="subEntry in entry.children" :key="subEntry.id">
                        <NuxtLink :to="subEntry.url">
                            {{ subEntry.name }}
                        </NuxtLink>
                    </div>
                </template>
            </div>

            <nav>
                <NuxtLink to="/">
                    Index
                </NuxtLink>
                <NuxtLink to="/customer">
                    Customer
                </NuxtLink>
                <NuxtLink to="/customer/login">
                    Login
                </NuxtLink>
            </nav>
        </header>
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useNavigation } from '#imports'

const { navigation, getNavigation } = useNavigation()

await getNavigation()
</script>

<style scoped>

</style>
