<template>
    <MiscDefineLink :to="computedTo">
        <slot />
    </MiscDefineLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app'
import { useLocalisation } from '#imports'

const props = defineProps({
    to: {
        type: String,
        required: true
    }
})

const route = useRoute()
const { isLocalisedRoute } = useLocalisation()
const routeLocale = isLocalisedRoute(route.path)

const computedTo = computed(() => {
    if (routeLocale) {
        let path = props.to
        if (path.startsWith('/')) {
            path = path.substring(1)
        }

        return `/${routeLocale}${path === '' ? '' : '/'}${path}`
    }

    return props.to
})
</script>
