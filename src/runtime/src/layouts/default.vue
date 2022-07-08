<template>
    <div class="default-layout">
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
                <NuxtLink to="/navigation/19ca405790ff4f07aac8c599d43178686">
                    404
                </NuxtLink>
            </nav>
        </header>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { useNavigation } from '#imports'
import { throwError } from '#app'

const { navigation, getNavigation } = useNavigation()

try {
    await getNavigation()
} catch (e) {
    throwError(e)
}
</script>

<style scoped>

</style>
