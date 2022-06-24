<template>
    <div>
        <header>
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

<script setup>

</script>

<style scoped>

</style>
