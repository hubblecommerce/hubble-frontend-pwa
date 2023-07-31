<template>
    <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
            <Bars3Icon class="h-5 w-5" />
        </label>

        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li v-for="entry in navigation" :key="entry.id">
                <template v-if="entry.children?.length > 0">
                    <details>
                        <summary>
                            <MiscLink no-prefetch :to="entry.url" class="justify-between">
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
    </div>
</template>

<script setup lang="ts">
import { Bars3Icon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import { HblNavigation } from '@/utils/types'

const props = defineProps<{
    navigation: HblNavigation
}>()
</script>
