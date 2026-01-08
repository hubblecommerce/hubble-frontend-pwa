<template>
    <ul class="menu w-full menu-horizontal p-0">
        <li v-for="entry in navigation" :key="entry.id">
            <template v-if="entry.children?.length > 0">
                <details>
                    <summary>
                        <MiscLink no-prefetch :to="entry.url">
                            {{ entry.name }}
                        </MiscLink>
                    </summary>
                    <ul class="p-2 bg-base-100">
                        <li v-for="childEntry in entry.children" :key="childEntry.id">
                            <MiscLink no-prefetch :to="childEntry.url">
                                {{ childEntry.name }}
                            </MiscLink>
                        </li>
                    </ul>
                </details>
            </template>

            <template v-else>
                <MiscLink no-prefetch :to="entry.url">
                    {{ entry.name }}
                </MiscLink>
            </template>
        </li>
        <li>
            <MiscLink no-prefetch to="/navigation/19ca405790ff4f07aac8c599d43178686" class="nav-link">
                404
            </MiscLink>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { type HblNavigation } from '../../types'

const props = defineProps<{
    navigation: HblNavigation
}>()
</script>
