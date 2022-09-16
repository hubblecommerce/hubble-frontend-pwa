<template>
    <ul class="menu menu-horizontal p-0">
        <li v-for="entry in navigation" :key="entry.id">
            <template v-if="entry.children?.length > 0">
                <NuxtLink no-prefetch :to="entry.url">
                    {{ entry.name }}
                    <ChevronDownIcon class="fill-current h-4 w-4" />
                </NuxtLink>
                <ul class="p-2 bg-base-100">
                    <li v-for="childEntry in entry.children" :key="childEntry.id">
                        <NuxtLink no-prefetch :to="childEntry.url">
                            {{ childEntry.name }}
                        </NuxtLink>
                    </li>
                </ul>
            </template>

            <template v-else>
                <NuxtLink no-prefetch :to="entry.url">
                    {{ entry.name }}
                </NuxtLink>
            </template>
        </li>
        <li>
            <NuxtLink no-prefetch to="/navigation/19ca405790ff4f07aac8c599d43178686" class="nav-link">
                404
            </NuxtLink>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { Navigation } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    navigation: Navigation
}>()
</script>
