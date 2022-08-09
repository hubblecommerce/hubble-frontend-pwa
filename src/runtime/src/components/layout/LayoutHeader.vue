<template>
    <header>
        <!--
        <misc-plugin-slot name="layouts-default-navbar-before" :events="{}" :data="{}">
            This is a Fallback Text, in case there is no component matches this slot.
        </misc-plugin-slot>
        -->
        <nav class="bg-base-100 shadow-md relative z-50">
            <div class="navbar container m-auto px-6">
                <div class="navbar-start">
                    <LayoutNavigationMobile :navigation="navigation" />
                    <nuxt-link to="/" class="btn btn-ghost normal-case text-xl p-0">
                        hubble PWA
                    </nuxt-link>
                </div>

                <div class="navbar-center hidden lg:flex">
                    <LayoutNavigationHorizontal :navigation="navigation" />
                </div>

                <div class="navbar-end">
                    <div class="dropdown dropdown-end hidden md:block">
                        <label tabindex="0" class="btn btn-ghost btn-circle">
                            <div class="indicator">
                                <ColorSwatchIcon class="h-5 w-5" fill="none" />
                            </div>
                        </label>
                        <div tabindex="0" class="card card-compact dropdown-content w-52 bg-base-100 shadow">
                            <div class="card-body">
                                <select v-model="colorMode.preference" class="select select-primary max-w-xs">
                                    <option disabled selected>
                                        Theme
                                    </option>
                                    <option v-for="theme of themes" :key="theme">
                                        {{ theme }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div
                        tabindex="0"
                        class="btn btn-ghost btn-circle"
                        @click="toggleDrawer('search', 'right')"
                        @keydown.enter="toggleDrawer('search', 'right')"
                    >
                        <SearchIcon class="h-5 w-5" fill="none" />
                    </div>

                    <div class="dropdown dropdown-end">
                        <client-only>
                            <CustomerState />

                            <template #fallback>
                                <label class="btn btn-ghost btn-circle">
                                    <div class="indicator">
                                        <UserIcon class="h-5 w-5" />
                                    </div>
                                </label>
                            </template>
                        </client-only>
                    </div>

                    <div
                        tabindex="0"
                        class="btn btn-ghost btn-circle"
                        @click="toggleDrawer('cart', 'right')"
                        @keydown.enter="toggleDrawer('cart', 'right')"
                    >
                        <div class="indicator">
                            <ShoppingCartIcon class="h-5 w-5" fill="none" />

                            <client-only>
                                <span v-if="miniCart?.qty > 0" class="badge badge-sm indicator-item" v-text="miniCart.qty" />
                            </client-only>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ShoppingCartIcon, SearchIcon, ColorSwatchIcon, UserIcon } from '@heroicons/vue/outline'
import { throwError } from '#app'
import { useNavigation, useColorMode, useCart, useDrawer } from '#imports'

const colorMode = useColorMode()
const themes = [
    'system',
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter'
]

const {
    navigation,
    getNavigation
} = useNavigation()

const { toggleDrawer } = useDrawer()

try {
    await getNavigation()
} catch (e) {
    throwError(e)
}

const { miniCart } = useCart()
</script>
