<template>
    <header>
        <nav class="bg-base-100 shadow-md relative z-40">
            <div class="navbar container m-auto px-2 lg:px-6">
                <div class="navbar-start">
                    <LayoutNavigationMobile :navigation="navigation" />
                    <MiscLink to="/" class="btn btn-ghost normal-case text-xl p-0">
                        hubble PWA
                    </MiscLink>
                </div>

                <div class="navbar-center hidden lg:flex">
                    <LayoutNavigationHorizontal :navigation="navigation" />
                </div>

                <div class="navbar-end">
                    <LayoutLanguageSwitch />

                    <div class="dropdown dropdown-end hidden md:block">
                        <label tabindex="0" class="btn btn-ghost btn-circle">
                            <div class="indicator">
                                <SwatchIcon class="h-5 w-5" fill="none" />
                            </div>
                        </label>
                        <div tabindex="0" class="card card-compact dropdown-content w-52 mt-3 bg-base-100 shadow">
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
                        <MagnifyingGlassIcon class="h-5 w-5" fill="none" />
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
                        @click="toggleDrawer('wishlist', 'right')"
                        @keydown.enter="toggleDrawer('wishlist', 'right')"
                    >
                        <div class="indicator">
                            <HeartIcon class="h-5 w-5" />

                            <client-only>
                                <span v-if="miniWishlist?.length > 0" class="badge badge-sm indicator-item" v-text="miniWishlist?.length" />
                            </client-only>
                        </div>
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
import { ShoppingCartIcon, MagnifyingGlassIcon, SwatchIcon, UserIcon, HeartIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { useNavigation, useColorMode, useCart, useDrawer, useWishlist, showError, useAsyncData } from '#imports'

const colorMode = useColorMode()
const themes = [
    'system',
    'light',
    'dark'
]

const {
    navigation,
    getNavigation
} = useNavigation()
const { toggleDrawer } = useDrawer()

const cartStore = useCart()
const { miniCart } = storeToRefs(cartStore)

const wishlistStore = useWishlist()
const { miniWishlist } = storeToRefs(wishlistStore)

const { data, error } = await useAsyncData(() => getNavigation())
navigation.value = data.value

if (error.value) {
    showError(error.value as Error)
}
</script>
