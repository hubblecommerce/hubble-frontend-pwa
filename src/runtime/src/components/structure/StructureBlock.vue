<template>
    <div ref="el" class="block" :class="content.cssClass" :style="backgroundStyles" style="border: 1px solid green; height: 600px;">
        <div>Block: {{ content.id }} Type: {{ content.type }}</div>

        <!-- If block contains only one slot, load slot directly -->
        <component :is="component" :content="content.slots.length === 1 ? content.slots[0] : content.slots" />
    </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref, shallowRef, defineAsyncComponent, resolveComponent, onMounted } from 'vue'
import { StructureLoading, StructureNoComponent } from '#components'
import { Block } from '../../../commons'

const props = defineProps<{
    count?: number,
    content: Block
}>()

const backgroundStyles: Ref<string | null> = computed(() => {
    let styles = null

    if (props.content.backgroundColor !== null) {
        styles = `background-color: ${props.content.backgroundColor}; `
    }

    if (props.content.backgroundMedia !== null) {
        styles = `background: url('${props.content.backgroundMedia.url}'); `
    }

    if (props.content.backgroundMediaMode !== null) {
        styles += `background-size: ${props.content.backgroundMediaMode}; `
    }

    return styles
})

const component = shallowRef()
// If more than one slots in block, directly load SLOT. If more than on slots then load BLOCK
const compName = computed(() => {
    let name = `StructureBlock${toUpperCamelCase(props.content.type)}`

    if (props.content.slots.length === 1) {
        name = `StructureSlot${toUpperCamelCase(props.content.slots[0].type)}`
    }

    return name
})

const toUpperCamelCase = function (string) {
    return string
        .toLowerCase()
        .split('-')
        .map(it => it.charAt(0).toUpperCase() + it.substring(1))
        .join('')
}

// Render first section server side (SEO relevant hero elements)
// TODO: find a more generic way to mark elements a SEO relevant
if (props.count === 0) {
    component.value = resolveComponent(`${compName.value}`)
}

// Lazy load other sections via intersection observer
const el = ref()
onMounted(() => {
    // TODO: find a more generic way to mark elements a SEO relevant
    if (props.count > 0) {
        registerIntersectionObserver(el.value)
    }
})

const registerIntersectionObserver = function (targetElement) {
    const options = {
        rootMargin: '20px',
        threshold: 0.01
    }

    const observer = new IntersectionObserver(intersectionCallback, options)
    observer.observe(targetElement)
}

const intersectionCallback = function (entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            loadComponent()
            observer.disconnect()
        }
    })
}

// For lazy loaded components
const loadComponent = function () {
    component.value = defineAsyncComponent({
        // the loader function
        loader: () => import(`./${props.content.slots.length === 1 ? 'slot' : 'block'}/${compName.value}.vue`),

        // A component to use while the async component is loading
        loadingComponent: StructureLoading,

        // Delay before showing the loading component. Default: 200ms.
        delay: 200,

        // A component to use if the load fails
        errorComponent: StructureNoComponent,

        // The error component will be displayed if a timeout is
        // provided and exceeded. Default: Infinity.
        timeout: 3000
    })
}
</script>
